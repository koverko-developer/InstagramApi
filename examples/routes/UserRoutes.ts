import {Request, Response} from "express";
import { get } from 'lodash';
import * as Bluebird from 'bluebird';



export class Routes {

    public routes(app, IgApiClient, IgLoginTwoFactorRequiredError, fs, promisify): void {
      const readFile = promisify(fs.readFile);
      const writeFile = promisify(fs.writeFile);
      const existsAsync = promisify(fs.exists);
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
                console.log(data)
              })

            })();
          res.status(200).send('')

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
                   followers => console.log(followers.length),
                   error => console.error(error),
                   () => console.log('Complete!'),
                 );
                 res.send('details')
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
                   followers => console.log(followers.length),
                   error => console.error(error),
                   () => console.log('Complete!'),
                 );
                 res.send('details')
               }

             })();
           }catch(e){
             console.log(e);
           }
        })

        app.route('/media/:userName/feed')
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
                     console.log('count like = '+ count_likes + '  count comments = ' + count_comments)
                     console.log('Complete! ....... -----' + all_feed.length)
                   }),
                 );
                 res.send('details')
               }

             })();
           }catch(e){
             console.log(e);
           }
        })

    }
}
