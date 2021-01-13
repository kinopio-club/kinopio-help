---
title: API Docs
color: '#d3badf'
layout: "layouts/api.pug"
---
<img src="/assets/cat.png" class="cat no-shadow"/>

The Kinopio API is used to find, save, and update the spaces of signed up users. You can use it to make cool things too.

Use of the API is subject to the [Use Restrictions Policy](/posts/use-restrictions-policy/).

# Authentication

Kinopio uses token-based authentication using your user `apiKey`. The easiest way to get your apiKey is by entering `JSON.parse(localStorage.user).apiKey` in your browser console on [kinopio.club](http://kinopio.club).

Use your apiKey in the `Authorization` header of each request.

> 🙈 Your API key carries the same privileges as your user account, so be sure to keep it secret!

(For testing, you can also use a query string (`?apiKey=`) but this is less secure and not recommended)

# Rate Limits

The API is limited to 5 requests per second. If you exceed this rate, you will receive a `429` response and will need to wait 30 seconds before subsequent requests will succeed.

# Routes

<a class="anchor" name="all"></a>
<h2 class="all">All</h2>

[https://api.kinopio.club](https://api.kinopio.club) is the base path for all routes

Method | Name | Description | Auth
--- | --- | --- | ---
`GET` | <code class="all">/</code> | Confirm that the API server is online | None


<a class="anchor" data-section="👯‍♀️" name="users"></a>
<h2 class="users">Users</h2>

Users are representations of any account on Kinopio. Users are created by the server when they sign up.

<h3 class="users">User Routes</h3>

Routes with Auth as `apiKey` mean that the Authorization header apiKey must match the requested user.

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`   | <code class="users">/user/public/:userId</code>         | Gets public info on a user                                                                                                                                | None
`GET`   | <code class="users">/user</code>                        | Get all info on the authenticating user                                                                                                                   | `apiKey`
`GET`   | <code class="users">/user/favorites</code>              | Gets all info, including user and space favorites, on the authenticating user                                                                             | `apiKey`
`GET`   | <code class="users">/user/spaces</code>                 | Get a list of the user's <a href="#spaces" class="badge spaces">Spaces</a>                                                                                | `apiKey`
`GET`   | <code class="users">/user/removed-spaces</code>         | Get <a href="#spaces" class="badge spaces">Spaces</a> removed by the authenticating user                                                                  | `apiKey`
`GET`   | <code class="users">/user/current-public-spaces</code>  | Get a list of all users currently viewing or editing <a href="#spaces" class="badge spaces">Spaces</a> with privacy set to `open`                         | None
`GET`   | <code class="users">/user/tags</code>                   | Get a list of the last edited <a href="#tags" class="badge tags">Tags</a> in your spaces                                                                  | `apiKey`
`PATCH` | <code class="users">/user</code>                        | Update the authenticating user(s) based on an object body with user attributes. You can't patch `apiKey`, `password`, `emailIsVerified`, or `email`       | `apiKey`
`PATCH` | <code class="users">/user/favorites</code>              | Add or remove favorite users or spaces. Acts like a toggle, if the user is already liked it then removes the like. If not already liked it adds the like. request body should be in the format. | `apiKey`

<h3 class="users">User Attributes</h3>

Name | Type | Description
--- | --- | ---
id                      | `String`  | The unique ID of the user. Is not user updateable
name                    | `String`  | The unique name of the user. Is a url-safe string (no spaces or special characters) because it's also used for url slugs
email                   | `String`  | The unique email address of the user required to create an account"
emailIsVerified         | `Boolean` | Whether the user has verified their email address
apiKey                  | `UUID`    | Used in Authentication headers to make API calls as the currentUser. Generated and returned only when user signs up or in. Is not user updateable
lastSpaceId             | `String`  | The spaceId of the last space edited. Used to return you to the same space the next time you visit kinopio.club
color                   | `String`  | User color changes your paint stroke and default avatar color
defaultConnectionTypeId | `String`  | The last connectionTypeId that the user marked as 'Default' to use for new <a href="#connections" class="badge connections">Connections</a>
lastReadNewStuffId      | `String`  | The id of the last read article from the 'new stuff' newsfeed
currentPublicSpaceId    | `String`  | The id of an space with privacy set to `open` that the user is currently viewing or editing
cardsCreatedCount       | `Integer` | The number of cards the user has created if they're not a paid user, used to enforce the free user limit. Is not user updatable.
isUpgraded              | `Boolean` | Whether the user currently has a paid subscription. Is not user updatable.
filterShowUsers         | `Boolean` | Whether the user has has toggled the card user filter
filterShowDateUpdated   | `Boolean` | Whether the user has has toggled the card date filter
filterShowAbsoluteDates | `Boolean` | Whether card dates are displayed as absolute (false is default relative)
journalPrompts          | `Array`   | id, name, and packId for each user journal prompt. Private user info.
newSpacesAreBlank       | `Boolean` | Whether new spaces that the user creates are blank, or have the default onboarding/tutorial cards
shouldHideCardTips      | `Boolean` | Whether the user has chosen to hide the card editing tips button ('?')

<a class="anchor" data-section="🍓" name="spaces"></a>
<h2 class="spaces">Spaces</h2>

Spaces are where your <a href="#cards" class="badge cards">Cards</a> and <a href="#connections" class="badge connections">Connections</a> live.

<h3 class="spaces">Space Routes</h3>

Routes with Auth `canViewSpace` or `canEditSpace` requires that your Authorization apiKey belongs to a user with the permission to view or edit the space.

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`    | <code class="spaces">/space/:spaceId</code>              | Get info on a space by id                                                                 | `canViewSpace`
`GET`    | <code class="spaces">/space/new-spaces</code>            | Get a list of recently updated spaces which are open or closed and have been renamed      | None
`GET`    | <code class="spaces">/space/best-of</code>               | A subset of `new-spaces` that have explicitly been curated by Kinopio                     | None
`GET`    | <code class="spaces">/space/:spaceId/<br>removedCards</code> | Get <a href="#cards" class="badge cards">Cards</a> removed in a space                 | `canEditSpace`
`GET`    | <code class="spaces">/space/by-url/:spaceUrl</code>      | Get info on a space by space url format (:space-name-:id)                                 | `canViewSpace`
`GET`    | <code class="spaces">/space/multiple?spaceIds=spaceId1,spaceId2</code> | Get info on multiple spaces, up to 60 spaceIds at a time                      | `canViewSpace`
`POST`   | <code class="spaces">/space</code>                       | Create a new space(s) from object(s) in request body. The owner will be the apiKey user   | `apiKey`
`PATCH`  | <code class="spaces">/space</code>                       | Update space(s) from object(s) in request body                                            | `canEditSpace`
`PATCH`  | <code class="spaces">/space/restore</code>               | Restore removed space(s)  from object(s) in request body                                  | `canEditSpace`
`DELETE` | <code class="spaces">/space</code>                       | Remove space(s) specified in request body                                                 | `canEditSpace`
`DELETE` | <code class="spaces">/space/permanent</code>             | Permanently remove space(s) specified in request body                                     | `canEditSpace`
`DELETE` | <code class="spaces">/space/collaborator</code>          | Removes collaborator user from space. Request Body Keys: `spaceId`, `userId`              | `canEditSpace`

<h3 class="spaces">Space Attributes</h3>

Name | Type | Description
--- | --- | ---
id                  | `String`  | The unique ID of the space. Is not user updateable
name                | `String`  | The name of the space
url                 | `String`  | The url of a space is determined by it's `name` and `id`. For example, `kinopio.club/:space-name-:id`
ownerUserId         | `String`  | The userId of the user who created the space. Used to create url slugs
privacy             | `String`  | Can be `open`, `closed`, `private`
isRemoved           | `Boolean` | Sets whether the space has been soft-removed. (can then be restored or permanently removed)
removedByUserId     | `String`  | The user who soft-removed the space. All space users can restore it via the API, but only the user who removed it will see it listed
collaboratorKey     | `String`  | Used like an apikey to allow editing, but just for that space. allows anonymous users who aren't signed in to edit a space. You can rotate this key, but you should still treat it as a secret
users               | `Array`   | The user who created/owns the space (a space will always have only one user)
collaborators       | `Array`   | A list of users that can also edit the space
cards               | `Array`   | A list of <a href="#cards" class="badge cards">Cards</a> in the space
connections         | `Array`   | A list of <a href="#connections" class="badge connections">Connections</a>
connectionTypes     | `Array`   | A list of <a href="#connection-types" class="badge connection-types">Connection Types</a>
tags                | `Array`   | A list of <a href="#tags" class="badge tags">Tags</a>
moonPhase           | `String`  | Name of the moonPhase icon used by Journal spaces
showInExplore       | `Boolean` | Whether the space is shown in explore
bestOfExplore       | `Boolean` | Whether the space has been curated by Kinopio
originSpaceId       | `String`  | If the space was created by duplicating another space, the origin space id is recorded


<a class="anchor" data-section="🎑" name="cards"></a>
<h2 class="cards">Cards</h2>

Cards are the building blocks of <a href="#spaces" class="badge spaces">Spaces</a>. They have `x`, `y`, and `z` positions and a `name`.

<h3 class="cards">Cards Routes</h3>

Routes with Auth `canEditSpace` requires that your Authorization apiKey belongs to a user with the permission to edit the space that the card belongs to.

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`     | <code class="cards">/card/:cardId</code>                | Get info on a card                                                                                                                                                                  | None
`GET`     | <code class="cards">/card/by-tag-name/:tagName</code>   | get all cards with tag matching tagName in your <a href="#spaces" class="badge spaces">Spaces</a>                                                                                   | `apiKey`
`GET`     | <code class="cards">/card/by-link-to-space/:spaceId</code>   | get the cards and <a href="#spaces" class="badge spaces">Spaces</a> where `linkToSpaceId` is `spaceId`. Will only return spaces that the user can view                         | `apiKey and canViewSpace`
`GET`     | <code class="cards">/card/by-tag-name-and-user/:tagName/:userId</code>   | get cards tagged with `tagName` in spaces that the `userId` can edit. Only returns results from spaces which you have permission to view                           | `apiKey and canViewSpace`
`POST`    | <code class="cards">/card</code>                        | Create card(s) from object(s) in request body. Body object must contain `spaceId` and `name`. If not included, `x`, `y`, `z` will be near the last updated card in the space        | `canEditSpace`
`PATCH`   | <code class="cards">/card</code>                        | Update card(s) from object(s) in request body. Body object must contain `id`                                                                                                        | `canEditSpace`
`PATCH`   | <code class="cards">/card/restore</code>                | Restore removed card specified in body                                                                                                                                              | `canEditSpace`
`DELETE`  | <code class="cards">/card</code>                        | Remove card specified in body                                                                                                                                                       | `canEditSpace`
`DELETE`  | <code class="cards">/card/permanent</code>              | Permanently remove card specified in body                                                                                                                                           | `canEditSpace`

<h3 class="cards">Card Attributes</h3>

Name | Type | Description
--- | --- | ---
id                    | `String`  | The unique ID of the card. Is not user updateable
name                  | `String`  | The name of the card is it's main text
x                     | `Integer` | x-axis position
y                     | `Integer` | y-axis position
z                     | `Integer` | z-axis position
frameId               | `String`  | The id of type of frame applied to the card, if any
isRemoved             | `Boolean` | Sets whether the card has been soft-removed. (can be restored or permanently removed by space users)
spaceId               | `String`  | The space that the card belongs to
nameUpdatedByUserId   | `String`  | The user id that last updated the name of the card
nameUpdatedAt         | `String`  | The updated at date for the card name
linkToSpaceId         | `String`  | The spaceId linked to in the card name
commentIsVisible      | `Boolean` | If the card is a ((comment)), determines whether the full comment displays (instead of '…')

<a class="anchor" data-section="🍆" name="connections"></a>
<h2 class="connections">Connections</h2>

Connections are the lines that connect cards together. Connections have a `connection-type` which assigns them a color and allows the user to thematically group cards together by connected type.

<h3 class="connections">Connection Routes</h3>

Routes with Auth `canEditSpace` requires that your Authorization apiKey belongs to a user with the permission to edit the space that the connection belongs to.

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`     | <code class="connections">/connection/<br/>:connectionId</code> | Get info on a connection                                                                                    | None
`POST`    | <code class="connections">/connection</code>                    | Create connection(s) from object in request body. Object must contain `spaceId`, `connectionTypeId`   | `canEditSpace`
`PATCH`   | <code class="connections">/connection</code>                    | Update connection(s) from object in request body                                                            | `canEditSpace`
`DELETE`  | <code class="connections">/connection</code>                    | Permenently remove connection(s) speced in req body                                                         | `canEditSpace`

<h3 class="connections">Connection Attributes</h3>

Name | Type | Description
--- | --- | ---
id                | `String` | The unique ID of the connection. Is not user updateable
startCardId       | `String` | The card that the connection line starts from
endCardId         | `String` | The card that the connection line ends at
path              | `String` | <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths">SVG path</a> that defines the connection line and it's curve, e.g. 'm524,138 q90,40 49,123' is a quadratic bezier curve made up of origin XY, control point XY, and end XY points.
connectionTypeId  | `String` | The connection-type that the connection belongs to
spaceId           | `String` | The space that the connection belongs to


<a class="anchor" data-section="💐" name="connection-types"></a>
<h2 class="connection-types">Connection Types</h2>

Connection Types group <a href="#connections" class="badge connections">Connections</a> together to allow the attributes of multiple connection lines to be represented and edited together.

<h3 class="connection-types">Connection Type Routes</h3>

Routes with Auth `canEditSpace` requires that your Authorization apiKey belongs to a user with the permission to edit the space that the connection type belongs to.

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`     | <code class="connection-types">/connection-type/:connectionTypeId</code>  | Get info on a connectionType                                                                         | None
`POST`    | <code class="connection-types">/connection-type</code>                    | Create connectionType(s) from object (or array) in request body. Object must contain `spaceId`       | `canEditSpace`
`PATCH`   | <code class="connection-types">/connection-type</code>                    | Update connectionType(s) from object in request body                                                 | `canEditSpace`
`DELETE`  | <code class="connection-types">/connection-type</code>                    | Permenently remove connectionType                                                                    | `canEditSpace`

<h3 class="connection-types">Connection Type Attributes</h3>

Name | Type | Description
--- | --- | ---
id      | `String` | The unique ID of the connection. Is not user updateable
name    | `String` | The name of the connection-type
color   | `String` | User color changes your paint stroke and default avatar color
spaceId | `String` | The space that the connection-type belongs to


<a class="anchor" data-section="🦚" name="tags"></a>
<h2 class="tags">Tags</h2>

Each tag you add to a card is considered a seperate entity. So if you have two cards which both have the tag [[balloon]], this is two tag entities both named 'balloon', with different cardIds.

<h3 class="tags">Tags Routes</h3>

Routes with Auth `canEditSpace` requires that your Authorization apiKey belongs to a user with the permission to edit the space that the connection type belongs to.

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`     | <code class="tags">/tags/:tagName</code>          | Get all tags with tagName in your <a href="#spaces" class="badge spaces">Spaces</a>                                                                      | `apiKey`
`GET`     | <code class="tags">/tags/by-card/:cardId</code>   | Get all tags in a <a href="#cards" class="badge cards">Cards</a>                                                                                        | `apiKey`
`PATCH`   | <code class="tags">/tags/color</code>             | Change the color of all tags with the name specified in request body. Object must contain `name`, `color`     | `apiKey`

<h3 class="tags">Tags Attributes</h3>

Name | Type | Description
--- | --- | ---
id      | `String` | The unique ID of the tag. Is not user updateable
name    | `String` | The name of the tag
color   | `String` | Tag color, displayed on a card
cardId  | `String` | The card that the tag belongs to
spaceId | `String` | The space that the tag belongs to
