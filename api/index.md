---
# title: API Docs
color: '#d3badf'
layout: "layouts/api.pug"
pageTitle: Kinopio API Docs
pageSearchIsVisible: false
currentPage: api
title: Kinopio API
---
<img src="/assets/cat.png" class="cat no-shadow"/>

The Kinopio API is used to find, save, and update the spaces of signed up users. You can use it to make cool things too.

Use of the API is subject to the [Use Restrictions Policy](/posts/use-restrictions-policy/).

## Authentication

Kinopio uses token-based authentication using your user `apiKey`. You can get your apiKey in the app through `User → Settings → Api Key`.

> 🙈 Your API key carries the same privileges as your user account, so be sure to keep it secret!

Use your apiKey in the `Authorization` header of each request.

(For testing, you can also use a query string (`?apiKey=`) but this is less secure and not recommended)

## Rate Limits

The API is limited to 5 requests per second. If you exceed this rate, you will receive a `429` response and will need to wait 30 seconds before subsequent requests will succeed.

## Routes

<a class="anchor" name="all"></a>
<h2 class="badge all">All</h2>

[https://api.kinopio.club](https://api.kinopio.club) is the base path for all routes

Method | Name | Description | Auth
--- | --- | --- | ---
`GET` | <code class="all">/</code> | Confirm that the API server is online | None


<a class="anchor" data-section="👯‍♀️" name="users"></a>
<h2 class="badge users">Users</h2>

Users are representations of any account on Kinopio. Users are created by the server when they sign up.

<h3 class="badge users">User Routes</h3>

Routes with Auth as `apiKey` mean that the Authorization header apiKey must match the requested user.

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`   | <code class="users">/user/public/:userId</code>         | Gets public info on a user                                                                                                                                | None
`GET`   | <code class="users">/user/public/multiple</code>        | Gets public info for multiple userIds specified in a comma seperated query string (`?userIds=userId_abc,userId_xyz`)                                      | None
`GET`   | <code class="users">/user</code>                        | Get all info on the authenticating user                                                                                                                   | `apiKey`
`GET`   | <code class="users">/user/favorites</code>              | Gets all info, including user and space favorites, on the authenticating user. Favorited spaces which have unread updates will have `isEdited: true`      | `apiKey`
`GET`   | <code class="users">/user/spaces</code>                 | Get a list of the user's <a href="#spaces" class="badge spaces">Spaces</a>                                                                                | `apiKey`
`GET`   | <code class="users">/user/removed-spaces</code>         | Get <a href="#spaces" class="badge spaces">Spaces</a> removed by the authenticating user                                                                  | `apiKey`
`GET`   | <code class="users">/user/tags</code>                   | Get a list of the last edited <a href="#tags" class="badge tags">Tags</a> in your spaces                                                                  | `apiKey`
`PATCH` | <code class="users">/user</code>                        | Update the authenticating user(s) based on an object body with user attributes. You can't patch `apiKey`, `password`, `emailIsVerified`, or `email`       | `apiKey`
`PATCH` | <code class="users">/user/favorites</code>              | Add or remove favorite users or spaces. Acts like a toggle, if the user is already liked it then removes the like. If not already liked it adds the like. request body should be in the format. | `apiKey`

<h3 class="badge users">User Attributes</h3>

Name | Type | Description
--- | --- | ---
<code class="users">id</code>                      | `String`  | The unique ID of the user. Is not user updateable
<code class="users">name</code>                    | `String`  | The unique name of the user. Is a url-safe string (no spaces or special characters) because it's also used for url slugs
<code class="users">email</code>                   | `String`  | The unique email address of the user required to create an account
<code class="users">emailIsVerified</code>         | `Boolean` | Whether the user has verified their email address
<code class="users">apiKey</code>                  | `UUID`    | Used in Authentication headers to make API calls as the currentUser. Generated and returned only when user signs up or in. Is not user updateable
<code class="users">lastSpaceId</code>             | `String`  | The spaceId of the last space edited. Used to return you to the same space the next time you visit kinopio.club
<code class="users">color</code>                   | `String`  | User color changes your paint stroke and default avatar color
<code class="users">description</code>             | `String`  | A description of this particular user
<code class="users">website</code>                 | `String`  | The user's website, url validity is not checked
<code class="users">lastReadNewStuffId</code>      | `String`  | The id of the last read article from the 'new stuff' newsfeed
<code class="users">cardsCreatedCount</code>       | `Integer` | The number of cards the user has created if they're not a paid user, used to enforce the free user limit. Is not user updatable.
<code class="users">isUpgraded</code>              | `Boolean` | Whether the user currently has a paid subscription. Is not user updatable.
<code class="users">filterShowUsers</code>         | `Boolean` | Whether the user has has toggled the card user filter
<code class="users">filterShowDateUpdated</code>   | `Boolean` | Whether the user has has toggled the card date filter
<code class="users">filterShowAbsoluteDates</code> | `Boolean` | Whether card dates are displayed as absolute (false is default relative)
<code class="users">journalPrompts</code>          | `Array`   | id, name, and packId for each user journal prompt. Private user info.
<code class="users">newSpacesAreBlank</code>       | `Boolean` | Whether new spaces that the user creates are blank, or have the default onboarding/tutorial cards
<code class="users">shouldEmailNotifications</code>| `Boolean` | Whether the user has chosen to allow notification emails (default to true)
<code class="users">shouldEmailBulletin</code>     | `Boolean` | Whether the user has chosen to allow bulletin emails (default to true)
<code class="users">shouldShowMoreAlignOptions</code> | `Boolean` | Whether the user has chosen to view more card position alignment and distribution options (default to true)
<code class="users">shouldInvertZoomDirection</code>  | `Boolean` | Whether the user has chosen to invert the direction of zooming with cmd/ctrl-scroll
<code class="users">shouldUseLastConnectionType</code>	| `Boolean` | Whether the user has chosen to use last connection type for new connections
<code class="users">shouldShowCardCollaborationInfo</code>	| `Boolean` | Whether the user has chosen to show collaboration info (update date, users) inside cards
<code class="users">dialogFavoritesFilters</code>   | `String` | User perference for favorite spaces filter, is either `null`, `'currentUser'`, `'otherUsers'`
<code class="users">dialogSpaceFilters</code>       | `String` | User perference for spaces filter, is either `null`, `'journals'`, `'spaces'`

<a class="anchor" data-section="🍓" name="spaces"></a>
<h2 class="badge spaces">Spaces</h2>

Spaces are where your <a href="#cards" class="badge cards">Cards</a> and <a href="#connections" class="badge connections">Connections</a> live.

<h3 class="badge spaces">Space Routes</h3>

Routes with Auth `canViewSpace` or `canEditSpace` requires that your Authorization apiKey belongs to a user with the permission to view or edit the space.

The `closed` privacy state refers to `Public Read Only`.

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`    | <code class="spaces">/space/:spaceId</code>              | Get info on a space by id                                                                 | `canViewSpace`
`GET`    | <code class="spaces">/space/new-spaces</code>            | Get a list of recently updated spaces which are open or closed and have been renamed      | None
`GET`    | <code class="spaces">/space/live-spaces</code>           | Get a list of currently being edited spaces which are open or closed                      | None
`GET`    | <code class="spaces">/space/:spaceId/<br>removedCards</code> | Get <a href="#cards" class="badge cards">Cards</a> removed in a space                 | `canEditSpace`
`GET`    | <code class="spaces">/space/by-url/:spaceUrl</code>      | Get info on a space by space url format (:space-name-:id)                                 | `canViewSpace`
`GET`    | <code class="spaces">/space/multiple?spaceIds=spaceId1,spaceId2</code> | Get info on multiple spaces, up to 60 spaceIds at a time                    | `canViewSpace`
`GET`    | <code class="spaces">/space/new-spaces/feed.json</code>  | `RSS feed` for new spaces added to Explore                                                  | None
`GET`    | <code class="spaces">/space/:spaceId/feed.json</code>    | `RSS feed` for cards recently created or updated in a space. Use `?apiKey=` for private spaces  | `canViewSpace`
`POST`   | <code class="spaces">/space</code>                       | Create a new space(s) from object(s) in request body. The owner will be the apiKey user   | `apiKey`
`PATCH`  | <code class="spaces">/space</code>                       | Update space(s) from object(s) in request body                                            | `canEditSpace`
`PATCH`  | <code class="spaces">/space/restore</code>               | Restore removed space(s)  from object(s) in request body                                  | `canEditSpace`
`DELETE` | <code class="spaces">/space</code>                       | Remove space(s) specified in request body                                                 | `canEditSpace`
`DELETE` | <code class="spaces">/space/permanent</code>             | Permanently remove space(s) specified in request body                                     | `canEditSpace`
`DELETE` | <code class="spaces">/space/collaborator</code>          | Removes collaborator user from space. Request Body Keys: `spaceId`, `userId`              | `canEditSpace`

<h3 class="badge spaces">Space Attributes</h3>

Name | Type | Description
--- | --- | ---
<code class="spaces">id</code>                  | `String`  | The unique ID of the space. Is not user updateable
<code class="spaces">name</code>                | `String`  | The name of the space
<code class="spaces">url</code>                 | `String`  | The url of a space is determined by its `name` and `id`. For example, `kinopio.club/:space-name-:id`
<code class="spaces">ownerUserId</code>         | `String`  | The userId of the user who created the space. Used to create url slugs
<code class="spaces">privacy</code>             | `String`  | Can be `open`, `closed`, `private`
<code class="spaces">isRemoved</code>           | `Boolean` | Sets whether the space has been soft-removed. (can then be restored or permanently removed)
<code class="spaces">removedByUserId</code>     | `String`  | The user who soft-removed the space. All space users can restore it via the API, but only the user who removed it will see it listed
<code class="spaces">collaboratorKey</code>     | `String`  | Used like an apikey to allow editing, but just for that space. allows anonymous users who aren't signed in to edit a space. You can rotate this key, but you should still treat it as a secret
<code class="spaces">users</code>               | `Array`   | The user who created/owns the space (a space will always have only one user)
<code class="spaces">collaborators</code>       | `Array`   | A list of users that can also edit the space
<code class="spaces">cards</code>               | `Array`   | A list of <a href="#cards" class="badge cards">Cards</a> in the space
<code class="spaces">connections</code>         | `Array`   | A list of <a href="#connections" class="badge connections">Connections</a>
<code class="spaces">connectionTypes</code>     | `Array`   | A list of <a href="#connection-types" class="badge connection-types">Connection Types</a>
<code class="spaces">tags</code>                | `Array`   | A list of <a href="#tags" class="badge tags">Tags</a>
<code class="spaces">moonPhase</code>           | `String`  | Name of the moonPhase icon used by Journal spaces. Possible values are `new-moon`, `waxing-crescent`, `waxing-quarter`, `waxing-gibbous`, `full-moon`, `waning-gibbous`, `waning-quarter`, `waning-crescent`
<code class="spaces">showInExplore</code>       | `Boolean` | Whether the space is shown in explore
<code class="spaces">originSpaceId</code>       | `String`  | If the space was created by duplicating another space, the origin space id is recorded
<code class="spaces">editedAt</code>            | `String`  | The date when card contents in the space was last added or changed
<code class="spaces">editedByUserId</code>      | `String`  | The user id of the last user who edited or created a card in the space
<code class="spaces">createdAt</code>           | `String`  | The date when the space was created
<code class="spaces">updatedAt</code>           | `String`  | The date when any changes in the space were made including a member visiting it
<code class="spaces">background</code>          | `String`  | The image url used by the space background
<code class="spaces">backgroundTint</code>      | `String`  | The background color used to tint the space background

<a class="anchor" data-section="🎑" name="cards"></a>
<h2 class="badge cards">Cards</h2>

Cards are the building blocks of <a href="#spaces" class="badge spaces">Spaces</a>. They have `x`, `y`, and `z` positions and a `name`.

<h3 class="badge cards">Cards Routes</h3>

Routes with Auth `canEditSpace` requires that your Authorization apiKey belongs to a user with the permission to edit the space that the card belongs to.

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`     | <code class="cards">/card/:cardId</code>                | Get info on a card                                                                                                                                                                  | None
`GET`     | <code class="cards">/card/by-tag-name/:tagName</code>   | get all cards with tag matching tagName in your <a href="#spaces" class="badge spaces">Spaces</a>                                                                                   | `apiKey`
`GET`     | <code class="cards">/card/by-link-to-space/:spaceId</code>   | get the cards and <a href="#spaces" class="badge spaces">Spaces</a> where `linkToSpaceId` is `spaceId`. Will only return spaces that the user can view                         | `apiKey and canViewSpace`
`POST`    | <code class="cards">/card</code>                        | Create card(s) from object(s) in request body. Body object must contain `spaceId` and `name`. If not included, `x`, `y`, `z` will be near the last updated card in the space        | `canEditSpace`
`PATCH`   | <code class="cards">/card</code>                        | Update card(s) from object(s) in request body. Body object must contain `id`. `spaceId` cannot be patched.                                                                          | `canEditSpace`
`PATCH`   | <code class="cards">/card/restore</code>                | Restore removed card specified in body                                                                                                                                              | `canEditSpace`
`DELETE`  | <code class="cards">/card</code>                        | Remove card specified in body                                                                                                                                                       | `canEditSpace`
`DELETE`  | <code class="cards">/card/permanent</code>              | Permanently remove card specified in body                                                                                                                                           | `canEditSpace`

<h3 class="badge cards">Card Attributes</h3>

Name | Type | Description
--- | --- | ---
<code class="cards">id</code>                    | `String`  | The unique ID of the card. Is not user updateable
<code class="cards">name</code>                  | `String`  | The name of the card is its main text
<code class="cards">x</code>                     | `Integer` | x-axis position
<code class="cards">y</code>                     | `Integer` | y-axis position
<code class="cards">z</code>                     | `Integer` | z-axis position
<code class="cards">width</code>                 | `Integer` | card width
<code class="cards">height</code>                | `Integer` | card height
<code class="cards">frameId</code>               | `String`  | The id of type of frame applied to the card, if any
<code class="cards">isRemoved</code>             | `Boolean` | Sets whether the card has been soft-removed. (can be restored or permanently removed by space users)
<code class="cards">spaceId</code>               | `String`  | The space that the card belongs to
<code class="cards">nameUpdatedByUserId</code>   | `String`  | The user id that last updated the name of the card
<code class="cards">nameUpdatedAt</code>         | `String`  | The updated at date for the card name
<code class="cards">linkToSpaceId</code>         | `String`  | The spaceId linked to in the card name
<code class="cards">commentIsVisible</code>      | `Boolean` | If the card is a ((comment)), determines whether the full comment displays (instead of '…')
<code class="cards">urlPreviewIsVisible</code>   | `Boolean` | Whether the card will display a url preview (aka link unfurl)
<code class="cards">urlPreviewUrl</code>         | `String`  | The url that the card url preview is based on
<code class="cards">urlPreviewImage</code>       | `String`  | The url for the url preview image
<code class="cards">urlPreviewFavicon</code>     | `String`  | The url for the url preview favicon image
<code class="cards">urlPreviewTitle</code>       | `String`  | The title displayed in the url preview
<code class="cards">urlPreviewDescription</code> | `String`  | The description displayed in the line of the url preview. Because most sites stuff their description tags with SEO gibberish, descriptions are only displayed for whitelisted domains. Contact support to add a domain to the whitelist.
<code class="cards">urlPreviewErrorUrl</code>    | `String`  | The last url that the preview failed on (could be a private or broken url). If this matches `urlPreviewUrl`, the url preview won't be created


<a class="anchor" data-section="🍆" name="connections"></a>
<h2 class="badge connections">Connections</h2>

Connections are the lines that connect cards together. Connections have a `connection-type` which assigns them a color and allows the user to thematically group cards together by connected type.

<h3 class="badge connections">Connection Routes</h3>

Routes with Auth `canEditSpace` requires that your Authorization apiKey belongs to a user with the permission to edit the space that the connection belongs to.

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`     | <code class="connections">/connection/<br/>:connectionId</code> | Get info on a connection                                                                                    | None
`POST`    | <code class="connections">/connection</code>                    | Create connection(s) from object in request body. Object must contain `spaceId`, `connectionTypeId`   | `canEditSpace`
`PATCH`   | <code class="connections">/connection</code>                    | Update connection(s) from object in request body. `spaceId` cannot be patched.                              | `canEditSpace`
`DELETE`  | <code class="connections">/connection</code>                    | Permenently remove connection(s) speced in req body                                                         | `canEditSpace`

<h3 class="badge connections">Connection Attributes</h3>

Name | Type | Description
--- | --- | ---
<code class="connections">id</code>                | `String` | The unique ID of the connection. Is not user updateable
<code class="connections">startCardId</code>       | `String` | The card that the connection line starts from
<code class="connections">endCardId</code>         | `String` | The card that the connection line ends at
<code class="connections">path</code>              | `String` | <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths">SVG path</a> that defines the connection line and its curve, e.g. 'm524,138 q90,40 49,123' is a quadratic bezier curve made up of origin XY, control point XY, and end XY points.
<code class="connections">connectionTypeId</code>  | `String` | The connection-type that the connection belongs to
<code class="connections">spaceId</code>           | `String` | The space that the connection belongs to


<a class="anchor" data-section="💐" name="connection-types"></a>
<h2 class="badge connection-types">Connection Types</h2>

Connection Types group <a href="#connections" class="badge connections">Connections</a> together to allow the attributes of multiple connection lines to be represented and edited together.

<h3 class="badge connection-types">Connection Type Routes</h3>

Routes with Auth `canEditSpace` requires that your Authorization apiKey belongs to a user with the permission to edit the space that the connection type belongs to.

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`     | <code class="connection-types">/connection-type/:connectionTypeId</code>  | Get info on a connectionType                                                                         | None
`POST`    | <code class="connection-types">/connection-type</code>                    | Create connectionType(s) from object (or array) in request body. Object must contain `spaceId`       | `canEditSpace`
`PATCH`   | <code class="connection-types">/connection-type</code>                    | Update connectionType(s) from object in request body. `spaceId` cannot be patched.                   | `canEditSpace`
`DELETE`  | <code class="connection-types">/connection-type</code>                    | Permenently remove connectionType                                                                    | `canEditSpace`

<h3 class="badge connection-types">Connection Type Attributes</h3>

Name | Type | Description
--- | --- | ---
<code class="connection-types">id</code>      | `String` | The unique ID of the connection. Is not user updateable
<code class="connection-types">name</code>    | `String` | The name of the connection-type
<code class="connection-types">color</code>   | `String` | User color changes your paint stroke and default avatar color
<code class="connection-types">spaceId</code> | `String` | The space that the connection-type belongs to


<a class="anchor" data-section="🦚" name="tags"></a>
<h2 class="badge tags">Tags</h2>

Each tag you add to a card is considered a seperate entity. So if you have two cards which both have the tag [[balloon]], this is two tag entities both named 'balloon', with different cardIds.

<h3 class="badge tags">Tags Routes</h3>

Routes with Auth `canEditSpace` requires that your Authorization apiKey belongs to a user with the permission to edit the space that the connection type belongs to.

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`     | <code class="tags">/tags/:tagName</code>          | Get all tags with tagName in your <a href="#spaces" class="badge spaces">Spaces</a>                                                                      | `apiKey`
`GET`     | <code class="tags">/tags/by-card/:cardId</code>   | Get all tags in a <a href="#cards" class="badge cards">Cards</a>                                                                                        | `apiKey`
`PATCH`   | <code class="tags">/tags/color</code>             | Change the color of all tags with the name specified in request body. Object must contain `name`, `color`     | `apiKey`

<h3 class="badge tags">Tags Attributes</h3>

Name | Type | Description
--- | --- | ---
<code class="tags">id</code>      | `String` | The unique ID of the tag. Is not user updateable
<code class="tags">name</code>    | `String` | The name of the tag
<code class="tags">color</code>   | `String` | Tag color, displayed on a card
<code class="tags">cardId</code>  | `String` | The card that the tag belongs to
<code class="tags">spaceId</code> | `String` | The space that the tag belongs to

<a class="anchor" data-section="🛎" name="notifications"></a>
<h2 class="badge notifications">Notifications</h2>

Notifications are created when another user adds a card in a space that you're a member and not currently viewing. The notifying user can be either a space collaborator, or anyone viewing an open space.

<h3 class="badge notifications">Notifications Routes</h3>

Routes with Auth as `apiKey` mean that the Authorization header apiKey must match the requested user.

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`   | <code class="notifications">/notifications</code>  | Get the last 50 notifications for the current user | `apiKey`

<h3 class="badge notifications">Notifications Attributes</h3>

Name | Type | Description
--- | --- | ---
<code class="notifications">id</code>      | `String` | The unique ID of the notification. Is not user updateable
<code class="notifications">type</code>    | `String` | The action that created the notification (e.g. `addCard`)
<code class="notifications">recipientUserId</code>   | `String` | The user that'll receive the notification
<code class="notifications">cardId</code>  | `String` | The card that the notification involves
<code class="notifications">card</code>    | `Object` | Basic information about the <a href="#cards" class="badge cards">Card</a> `id`, `name`
<code class="notifications">spaceId</code> | `String` | The space that the notification involves
<code class="notifications">space</code>   | `Object` | Basic information about the <a href="#spaces" class="badge spaces">Space</a> `id`, `name`, `privacy`, `background`
<code class="notifications">userId</code>  | `String` | The user that created the notification
<code class="notifications">user</code>    | `Object` | Basic information about the <a href="#users" class="badge users">User</a> `id`, `name`, `color`
<code class="notifications">isRead</code>  | `Boolean` | Has the notification been read by the recipient in Kinopio
<code class="notifications">isEmailed</code>  | `Boolean` | Has the notification been emailed to the recipient. Emails are only sent if `user.shouldEmailNotifications = true`
