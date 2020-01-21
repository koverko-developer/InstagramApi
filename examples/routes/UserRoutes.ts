import {Request, Response, NextFunction } from "express";
import { get } from 'lodash';
import * as Bluebird from 'bluebird';
import * as firebase from 'firebase';
var apps = firebase.initializeApp({
apiKey: "AIzaSyAet4VmmuhViG6LgrAi7XAR0zzbccSUFPA",
authDomain: "shops-db02f.firebaseapp.com",
databaseURL: "https://shops-db02f.firebaseio.com",
projectId: "shops-db02f",
storageBucket: "shops-db02f.appspot.com",
messagingSenderId: "790389803332",
appId: "1:790389803332:web:1c509c640e38477bc36f11"});

const res_error = {type : 'error', msg : 'error in body server'}
const res_error_2fa = {type : 'error_2fa', msg : 'error 2fa auth'}

export class Routes {

    public routes(app, IgApiClient, IgLoginTwoFactorRequiredError, fs, promisify): void {
      const readFile = promisify(fs.readFile);
      const writeFile = promisify(fs.writeFile);
      const existsAsync = promisify(fs.exists);
      console.log(apps)
        app.route('/')
        .get((req: Request, res: Response) => {
            res.status(200).send({
                message: 'GET request successfulll!!!!'
            })
        })

        // Contact
        app.route('/auth')
        .post((req: Request, res: Response) => {
        // Create new contact
        const uname = req.body.uname;
        const password = req.body.password;
        const code = req.body.code;
      // Get all contacts
          (async () => {
            // Initiate Instagram API client
            const ig = new IgApiClient();
            ig.state.generateDevice(uname);
            ig.state.proxyUrl = process.env.IG_PROXY;

            await ig.simulate.preLoginFlow();
            try{
              const statePath = './tools/'+ uname+'.json';
              ig.state.generateDevice(uname);
              ig.request.end$.subscribe(async () => {
                const state = await ig.state.serialize();
                delete state.constants;
                await writeFile(statePath, JSON.stringify(state), { encoding: 'utf8' });
              });
            }catch(err){
              console.log(err);
            }

            // Perform usual login
            // If 2FA is enabled, IgLoginTwoFactorRequiredError will be thrown
              Bluebird.try(() => ig.account.login(uname, password)).catch(
                IgLoginTwoFactorRequiredError,
                async err => {
                  const twoFactorIdentifier = get(err, 'response.body.two_factor_info.two_factor_identifier');
                  if (!twoFactorIdentifier) {
                    res.send(res_error_2fa)
                    throw new Error('Unable to login, no 2fa identifier found');
                  }

                  return ig.account.twoFactorLogin({
                    username: uname,
                    verificationCode: code,
                    twoFactorIdentifier,
                    verificationMethod: '1', // '1' = SMS (default), '0' = OTP
                    trustThisDevice: '1', // Can be omitted as '1' is used by default
                  });
                },
              ).then(async data =>{
                 firebase.database().ref('/users/' + data['pk'] +'/info').set({
                   data
                 });
                res.status(200).send(data)
              })

            })();


        })

        // Contact detail
        app.route('/users/:userName')
        // get specific contact
        .post((req: Request, res: Response) => {
        // Get a single contact detail
        var uname = req.params.userName;
        try{
          const ig = new IgApiClient();
          ig.state.generateDevice(uname);
          ig.state.proxyUrl = process.env.IG_PROXY;
          (async () => {
            await ig.simulate.preLoginFlow();
            const statePath = './tools/'+ uname+'.json';;
            ig.state.generateDevice(uname);
            ig.request.end$.subscribe(async () => {
              //console.log('subscribe')
              const state = await ig.state.serialize();
              delete state.constants;
              await writeFile(statePath, JSON.stringify(state), { encoding: 'utf8' });
            });
            if (await existsAsync(statePath)) {
              await ig.state.deserialize(await readFile(statePath, { encoding: 'utf8' }));
              const user_ig  =  await ig.account.currentUser();
              const details = await ig.user.info(user_ig.pk)
              firebase.database().ref('/users/' + details['pk'] +'/details').set({
                details
              });
              res.send(details)
            }

          })();
        }catch(e){
          console.log(e);
        }
        })

        app.route('/audience/:userName/followers')
        // get specific contact
        .post((req: Request, res: Response) => {
           var uname = req.params.userName;
           try{
             const ig = new IgApiClient();
             ig.state.generateDevice(uname);
             ig.state.proxyUrl = process.env.IG_PROXY;
             (async () => {
               await ig.simulate.preLoginFlow();
               const statePath = './tools/'+ uname+'.json';;
               ig.state.generateDevice(uname);
               ig.request.end$.subscribe(async () => {
                 //console.log('subscribe')
                 const state = await ig.state.serialize();
                 delete state.constants;
                 await writeFile(statePath, JSON.stringify(state), { encoding: 'utf8' });
               });
               if (await existsAsync(statePath)) {
                 await ig.state.deserialize(await readFile(statePath, { encoding: 'utf8' }));
                 const user_ig  =  await ig.account.currentUser();
                 const followersFeed = ig.feed.accountFollowers(user_ig.pk);
                 const wholeResponse = await followersFeed.request();
                 console.log(wholeResponse); // You can reach any properties in instagram response
                 const items = await followersFeed.items();
                 console.log(items); // Here you can reach items. It's array.
                 const thirdPageItems = await followersFeed.items();
                 // Feed is stateful and auto-paginated. Every subsequent request returns results from next page
                 console.log(thirdPageItems); // Here you can reach items. It's array.
                 const feedState = followersFeed.serialize(); // You can serialize feed state to have an ability to continue get next pages.
                 console.log(feedState);
                 followersFeed.deserialize(feedState);
                 const fourthPageItems = await followersFeed.items();
                 console.log(fourthPageItems);
                 // You can use RxJS stream to subscribe to all results in this feed.
                 // All the RxJS powerful is beyond this example - you should learn it by yourself.
                 followersFeed.items$.subscribe(
                   (followers => {
                     console.log(followers.length)
                     firebase.database().ref('/users/' + user_ig.pk +'/followers').set({
                       followers
                     });
                     res.send({response : followers})
                   }),
                   error => console.error(error),
                   () => console.log('Complete!'),
                 );

               }

             })();
           }catch(e){
             console.log(e);
           }
        })

        app.route('/audience/:userName/following')
        // get specific contact
        .post((req: Request, res: Response) => {
           var uname = req.params.userName;
           try{
             const ig = new IgApiClient();
             ig.state.generateDevice(uname);
             ig.state.proxyUrl = process.env.IG_PROXY;
             (async () => {
               await ig.simulate.preLoginFlow();
               const statePath = './tools/'+ uname+'.json';;
               ig.state.generateDevice(uname);
               ig.request.end$.subscribe(async () => {
                 //console.log('subscribe')
                 const state = await ig.state.serialize();
                 delete state.constants;
                 await writeFile(statePath, JSON.stringify(state), { encoding: 'utf8' });
               });
               if (await existsAsync(statePath)) {
                 await ig.state.deserialize(await readFile(statePath, { encoding: 'utf8' }));
                 const user_ig  =  await ig.account.currentUser();
                 const followersFeed = ig.feed.accountFollowing(user_ig.pk);
                 const wholeResponse = await followersFeed.request();
                 console.log(wholeResponse); // You can reach any properties in instagram response
                 const items = await followersFeed.items();
                 console.log(items); // Here you can reach items. It's array.
                 const thirdPageItems = await followersFeed.items();
                 // Feed is stateful and auto-paginated. Every subsequent request returns results from next page
                 console.log(thirdPageItems); // Here you can reach items. It's array.
                 const feedState = followersFeed.serialize(); // You can serialize feed state to have an ability to continue get next pages.
                 console.log(feedState);
                 followersFeed.deserialize(feedState);
                 const fourthPageItems = await followersFeed.items();
                 console.log(fourthPageItems);
                 // You can use RxJS stream to subscribe to all results in this feed.
                 // All the RxJS powerful is beyond this example - you should learn it by yourself.
                 followersFeed.items$.subscribe(
                   (followers => {
                     console.log(followers.length)
                     firebase.database().ref('/users/' + user_ig.pk +'/following').set({
                       followers
                     });
                     res.send({response : followers})
                   }),
                   error => console.error(error),
                   () => console.log('Complete!'),
                 );

               }

             })();
           }catch(e){
             console.log(e);
           }
        })

        app.route('/audience/:userName/unfollowers')
        // get specific contact
        .post((req: Request, res: Response) => {
           var uname = req.params.userName;
           try{
             const ig = new IgApiClient();
             ig.state.generateDevice(uname);
             ig.state.proxyUrl = process.env.IG_PROXY;
             (async () => {
               await ig.simulate.preLoginFlow();
               const statePath = './tools/'+ uname+'.json';;
               ig.state.generateDevice(uname);
               ig.request.end$.subscribe(async () => {
                 //console.log('subscribe')
                 const state = await ig.state.serialize();
                 delete state.constants;
                 await writeFile(statePath, JSON.stringify(state), { encoding: 'utf8' });
               });
               if (await existsAsync(statePath)) {
                 await ig.state.deserialize(await readFile(statePath, { encoding: 'utf8' }));
                 const user_ig  =  await ig.account.currentUser();
                 const followersFeed = ig.feed.accountFollowers(user_ig.pk);
                 const wholeResponse = await followersFeed.request();
                 console.log(wholeResponse); // You can reach any properties in instagram response
                 const items = await followersFeed.items();
                 console.log(items); // Here you can reach items. It's array.
                 const thirdPageItems = await followersFeed.items();
                 // Feed is stateful and auto-paginated. Every subsequent request returns results from next page
                 console.log(thirdPageItems); // Here you can reach items. It's array.
                 const feedState = followersFeed.serialize(); // You can serialize feed state to have an ability to continue get next pages.
                 console.log(feedState);
                 followersFeed.deserialize(feedState);
                 const fourthPageItems = await followersFeed.items();
                 console.log(fourthPageItems);
                 // You can use RxJS stream to subscribe to all results in this feed.
                 // All the RxJS powerful is beyond this example - you should learn it by yourself.
                 followersFeed.items$.subscribe(
                   (followers => {
                     firebase.database().ref('/users/' + user_ig.pk+'/followers_old').once('value').then(function(snapshot) {
                       var followers_old = (snapshot.val() && snapshot.val().followers) || 'Anonymous';
                       if(followers_old === 'Anonymous')followers_old = (snapshot.val() && snapshot.val().followers_old) || 'Anonymous';
                       if(followers_old === 'Anonymous') {
                         firebase.database().ref('/users/' + user_ig.pk +'/followers_old').set({
                           followers
                         });
                         res.send({unfollowers : followers_old})
                       }else {

                         let arr_f : number[] = [];
                         let arr_unfollowers: any[] = [];

                         followers.forEach(element => {
                           arr_f.push(element['pk'])
                         });
                         followers_old.forEach(element => {
                           if(!arr_f.includes(element['pk'])) arr_unfollowers.push(element)
                         });
                         firebase.database().ref('/users/' + user_ig.pk +'/unfollowers').set({
                           arr_unfollowers
                         });
                         res.send(arr_unfollowers)
                       }
                     });
                   }),
                   error => console.error(error),
                   () => console.log('Complete!'),
                 );

               }

             })();
           }catch(e){
             console.log(e);
           }
        })

        app.route('/audience/:userName/newfollowers')
        // get specific contact
        .post((req: Request, res: Response) => {
           var uname = req.params.userName;
           try{
             const ig = new IgApiClient();
             ig.state.generateDevice(uname);
             ig.state.proxyUrl = process.env.IG_PROXY;
             (async () => {
               await ig.simulate.preLoginFlow();
               const statePath = './tools/'+ uname+'.json';;
               ig.state.generateDevice(uname);
               ig.request.end$.subscribe(async () => {
                 //console.log('subscribe')
                 const state = await ig.state.serialize();
                 delete state.constants;
                 await writeFile(statePath, JSON.stringify(state), { encoding: 'utf8' });
               });
               if (await existsAsync(statePath)) {
                 await ig.state.deserialize(await readFile(statePath, { encoding: 'utf8' }));
                 const user_ig  =  await ig.account.currentUser();
                 const followersFeed = ig.feed.accountFollowers(user_ig.pk);

                 followersFeed.items$.subscribe(
                   (followers => {
                     firebase.database().ref('/users/' + user_ig.pk+'/followers_old').once('value').then(function(snapshot) {
                       var followers_old = (snapshot.val() && snapshot.val().followers) || 'Anonymous';
                       if(followers_old === 'Anonymous')followers_old = (snapshot.val() && snapshot.val().followers_old) || 'Anonymous';
                       if(followers_old === 'Anonymous') {
                         firebase.database().ref('/users/' + user_ig.pk +'/followers_old').set({
                           followers
                         });
                         res.send({unfollowers : followers_old})
                       }else {

                         let arr_f : number[] = [];
                         let arr_new: any[] = [];

                         followers_old.forEach(element => {
                           arr_f.push(element['pk'])
                         });
                         followers.forEach(element => {
                           if(!arr_f.includes(element['pk'])) {
                             arr_new.push(element)
                           }
                         });
                         arr_new.forEach(element => {
                           followers_old.push(element)
                         });
                         firebase.database().ref('/users/' + user_ig.pk +'/followers_old').set({
                           followers_old
                         });
                         firebase.database().ref('/users/' + user_ig.pk +'/newfollowers').set({
                           arr_new
                         });
                         res.send(arr_new)
                       }
                     });
                   }),
                   error => console.error(error),
                   () => console.log('Complete!'),
                 );

               }

             })();
           }catch(e){
             console.log(e);
           }
        })

        app.route('/audience/:uid/followers_and_following')
        // get specific contact
        .post((req: Request, res: Response) => {
           var uid = req.params.uid;
           try{

             firebase.database().ref('/users/' + uid+'/followers').once('value').then(function(snapshot) {
                var followers = (snapshot.val() && snapshot.val().followers) || 'Anonymous';
                firebase.database().ref('/users/' + uid+'/following').once('value').then(function(snapshot) {
                  var following = (snapshot.val() && snapshot.val().followers) || 'Anonymous';
                  let arr_id_followers : number[] = [];
                  let arr_id_following : number[] = [];

                  let array_1 : any[] = []; //взаимные подписчики
                  let array_2 : any[] = []; //на кого вы не подписаны
                  let array_3 : any[] = []; //не взаимная подписка

                  followers.forEach(element => {
                    arr_id_followers.push(element['pk'])
                  });

                  following.forEach(element => {
                    arr_id_following.push(element['pk'])
                  });

                  ////------------ Вычесляем взаимные подписчики -----------------------

                  followers.forEach(element => {
                    if(arr_id_following.includes(element['pk'])) array_1.push(element)
                  });


                  /////// ------------- Те на кого вы не подписаны --------------------

                  followers.forEach(element => {
                    if(!arr_id_following.includes(element['pk'])) array_2.push(element)
                  });


                  ////// -------------- Не взаимные подписки -------------------------

                  following.forEach(element => {
                    if(!arr_id_followers.includes(element['pk'])) {
                      console.log(element['username'])
                      array_3.push(element)
                    }
                  });


                  res.send({response : {mutually : array_1, no_mutually : array_2, following_no_mutually : array_3}})

                });
             });
           }catch(e){
             console.log(e);
           }
        })

        app.route('/media/:userName/feedInfo')
        // get specific contact
        .post((req: Request, res: Response, next: NextFunction) => {
           var uname = req.params.userName;
           try{
             const ig = new IgApiClient();
             ig.state.generateDevice(uname);
             ig.state.proxyUrl = process.env.IG_PROXY;
             (async () => {
               await ig.simulate.preLoginFlow();
               const statePath = './tools/'+ uname+'.json';;
               ig.state.generateDevice(uname);
               ig.request.end$.subscribe(async () => {
                 const state = await ig.state.serialize();
                 delete state.constants;
                 await writeFile(statePath, JSON.stringify(state), { encoding: 'utf8' });
               });

               if (await existsAsync(statePath)) {
                 await ig.state.deserialize(await readFile(statePath, { encoding: 'utf8' }));
                 const user_ig  =  await ig.account.currentUser();
                 const userFeed = ig.feed.user(user_ig.pk);
                 var all_feed : any[] = []
                 userFeed.items$.subscribe(
                   (followers => {
                     followers.forEach(function (value) {
                      all_feed.push(value)
                      });
                   }),
                   error => console.error(error),
                   (() => {
                     var count_comments : number = 0;
                     var count_likes : number = 0;
                     all_feed.forEach(element => {
                       count_comments += element.comment_count;
                       count_likes += element.like_count;
                     });
                     var feedInfo_json = {response : {count_likes : count_likes, count_comments : count_comments, count_media : all_feed.length}}
                     firebase.database().ref('/users/' + user_ig.pk +'/feedInfo').set({
                       feedInfo_json
                     });
                     res.send(feedInfo_json)


                   }),
                 );

               }

             })();
           }catch(e){
             res.send(res_error)
             console.log(e);
           }
        })



    }
}
