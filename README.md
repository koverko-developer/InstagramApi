# InstagramApi

# Menu
- [Auntification](#Auntification-user)
- [GrtUserInfo](#User-info)


# Auntification user
URI : http://45.141.100.127/auth
```text
body:
{
  uname : login account,
  password : password account,
  code : default : 000, (for 2fa code from SMS)
}

response : 
{
  pk: 5972326347,
  username: 'koverko_dev',
  full_name: 'Дмитрий Коверко',
  is_private: false,
  profile_pic_url: 'https://scontent-frt3-1.cdninstagram.com/v/t51.2885-19/s150x150/21909597_1759219181048039_6453465890141765632_n.jpg?_nc_ht=scontent-frt3-1.cdninstagram.com&_nc_ohc=oKFalyi5QpYAX9grWey&oh=bcc65e23ae1287a080b6de4174adad79&oe=5ED5508F',
  profile_pic_id: '1609401374448318861_5972326347',
  is_verified: false,
  has_anonymous_profile_picture: false,
  can_boost_post: true,
  is_business: true,
  account_type: 2,
  is_call_to_action_enabled: false,
  can_see_organic_insights: true,
  show_insights_terms: false,
  total_igtv_videos: 0,
  reel_auto_archive: 'on',
  has_placed_orders: false,
  allowed_commenter_type: 'any',
  nametag: { mode: 0, gradient: '0', emoji: '😀', selfie_sticker: '0' },
  can_hide_category: true,
  can_hide_public_contacts: true,
  should_show_category: true,
  should_show_public_contacts: true,
  can_see_primary_country_in_settings: false,
  allow_contacts_sync: false,
  phone_number: '+375333211737',
  country_code: 375,
  national_number: 333211737
}

```

# User info
URI : http://45.141.100.127/users/:uname
```text

response :
{
    "pk": 5972326347,
    "username": "koverko_dev",
    "full_name": "Люблю долбиться в жопу",
    "is_private": false,
    "profile_pic_url": "https://scontent-frt3-1.cdninstagram.com/v/t51.2885-19/s150x150/21909597_1759219181048039_6453465890141765632_n.jpg?_nc_ht=scontent-frt3-1.cdninstagram.com&_nc_ohc=oKFalyi5QpYAX9grWey&oh=bcc65e23ae1287a080b6de4174adad79&oe=5ED5508F",
    "profile_pic_id": "1609401374448318861_5972326347",
    "is_verified": false,
    "has_anonymous_profile_picture": false,
    "media_count": 38,
    "follower_count": 121,
    "following_count": 55,
    "following_tag_count": 0,
    "biography": "",
    "can_link_entities_in_bio": true,
    "biography_with_entities": {
        "raw_text": "",
        "entities": []
    },
    "external_url": "",
    "can_boost_post": true,
    "can_see_organic_insights": true,
    "show_insights_terms": false,
    "can_convert_to_business": false,
    "can_create_sponsor_tags": false,
    "can_be_tagged_as_sponsor": true,
    "can_see_support_inbox": false,
    "can_see_support_inbox_v1": false,
    "total_igtv_videos": 0,
    "total_ar_effects": 0,
    "reel_auto_archive": "on",
    "is_profile_action_needed": false,
    "usertags_count": 20,
    "usertag_review_enabled": false,
    "is_needy": true,
    "is_interest_account": true,
    "has_chaining": true,
    "hd_profile_pic_versions": [
        {
            "width": 320,
            "height": 320,
            "url": "https://scontent-frt3-1.cdninstagram.com/v/t51.2885-19/s320x320/21909597_1759219181048039_6453465890141765632_n.jpg?_nc_ht=scontent-frt3-1.cdninstagram.com&_nc_ohc=oKFalyi5QpYAX9grWey&oh=0f5015029b5c2f1fbd022c771430948b&oe=5E9BDCF7"
        },
        {
            "width": 640,
            "height": 640,
            "url": "https://scontent-frt3-1.cdninstagram.com/v/t51.2885-19/s640x640/21909597_1759219181048039_6453465890141765632_n.jpg?_nc_ht=scontent-frt3-1.cdninstagram.com&_nc_ohc=oKFalyi5QpYAX9grWey&oh=fcba886399a2f87bdeb648b517a584b3&oe=5EB6464C"
        }
    ],
    "hd_profile_pic_url_info": {
        "url": "https://scontent-frt3-1.cdninstagram.com/v/t51.2885-19/21909597_1759219181048039_6453465890141765632_n.jpg?_nc_ht=scontent-frt3-1.cdninstagram.com&_nc_ohc=oKFalyi5QpYAX9grWey&oh=1c4c7f3c8883c24d13b1c4c12bd28565&oe=5EA74FF7",
        "width": 1080,
        "height": 1080
    },
    "has_placed_orders": false,
    "can_tag_products_from_merchants": false,
    "show_shoppable_feed": false,
    "shoppable_posts_count": 0,
    "can_be_reported_as_fraud": false,
    "merchant_checkout_style": "none",
    "show_conversion_edit_entry": false,
    "aggregate_promote_engagement": true,
    "allowed_commenter_type": "any",
    "is_video_creator": false,
    "has_profile_video_feed": false,
    "has_highlight_reels": false,
    "is_eligible_to_show_fb_cross_sharing_nux": true,
    "eligible_shopping_signup_entrypoints": [],
    "direct_messaging": "UNKNOWN",
    "fb_page_call_to_action_id": "",
    "address_street": "",
    "business_contact_method": "CALL",
    "category": "Business",
    "city_id": 0,
    "city_name": "",
    "contact_phone_number": "80292920538",
    "is_call_to_action_enabled": false,
    "latitude": 0,
    "longitude": 0,
    "public_email": "kowerkodeveloper@gmail.com",
    "public_phone_country_code": "375",
    "public_phone_number": "292920538",
    "zip": "",
    "can_claim_page": false,
    "can_crosspost_without_fb_token": true,
    "num_of_admined_pages": 0,
    "page_id": null,
    "page_name": null,
    "ads_page_id": null,
    "ads_page_name": null,
    "profile_visits_count": 2,
    "profile_visits_num_days": 7,
    "fb_page_call_to_action_ix_app_id": 0,
    "fb_page_call_to_action_ix_label_bundle": {},
    "fb_page_call_to_action_ix_partner": "",
    "fb_page_call_to_action_ix_url": "",
    "is_call_to_action_enabled_by_surface": null,
    "instagram_location_id": "",
    "is_business": true,
    "account_type": 2,
    "can_hide_category": true,
    "can_hide_public_contacts": true,
    "should_show_category": true,
    "should_show_public_contacts": true,
    "is_facebook_onboarded_charity": false,
    "has_active_charity_business_profile_fundraiser": false,
    "charity_profile_fundraiser_info": {
        "pk": 5972326347,
        "is_facebook_onboarded_charity": false,
        "has_active_fundraiser": false,
        "consumption_sheet_config": {
            "can_viewer_donate": false,
            "currency": null,
            "donation_url": null,
            "privacy_disclaimer": null,
            "donation_disabled_message": "We're having trouble connecting right now. Please try your donation another time.",
            "donation_amount_config": null
        }
    },
    "can_see_primary_country_in_settings": false,
    "include_direct_blacklist_status": true,
    "can_follow_hashtag": true,
    "is_potential_business": true,
    "feed_post_reshare_disabled": false,
    "besties_count": 0,
    "show_besties_badge": true,
    "recently_bestied_by_count": 0,
    "nametag": {
        "mode": 0,
        "gradient": "0",
        "emoji": "😀",
        "selfie_sticker": "0"
    },
    "existing_user_age_collection_enabled": false,
    "auto_expand_chaining": false,
    "highlight_reshare_disabled": false,
    "show_post_insights_entry_point": true,
    "about_your_account_bloks_entrypoint_enabled": false
}

```
