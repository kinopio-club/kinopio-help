---
title: API Docs
color: '#d3badf'
layout: "layouts/api.pug"
---
<img src="/assets/cat.png" class="cat no-shadow"/>

The Kinopio API is used to find, save, and update the spaces of signed up users. You can use it to make cool things too.

# Authentication

Kinopio uses token-based authentication using your user `apiKey`. The easiest way to get your apiKey is by entering `JSON.parse(localStorage.user).apiKey` in your browser console on [kinopio.club](http://kinopio.club).

Use your apiKey in the `Authorization` header of each request.

> 🙈 Your API key carries the same privileges as your user account, so be sure to keep it secret!

(For testing, you can also use a query string (`?apiKey=`) but this is less secure and not recommended)

# Rate Limits

The API is limited to 5 requests per second. If you exceed this rate, you will receive a 429 status code and will need to wait 30 seconds before subsequent requests will succeed.

# Routes

<a name="all"></a>
<h2 class="all">All</h2>

[https://api.kinopio.club](https://api.kinopio.club) is the base path for all routes

Method | Name | Description | Auth
--- | --- | --- | ---
`GET` | <code class="all">/</code> | tells you if the api is online | None


<a name="users"></a>
<h2 class="users">Users</h2>

Users are representations of any account on Kinopio. Users are created by the server when they sign up.

Routes with Auth as `apiKey` mean that the Authorization header apiKey must match the requested user.

<h3 class="users">User Routes</h3>

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`   | <code class="users">/user/public/:userId</code>         | Get public info on a user JSON.parse(localStorage.user).id                              | None
`GET`   | <code class="users">/user</code>                        | Get all info on the authenticating user                                                 | `apiKey`
`GET`   | <code class="users">/user/favorites</code>              | Gets all info, including user and space favorites, on the authenticating user           | `apiKey`
`GET`   | <code class="users">/user/spaces</code>                 | Get a list of the user's spaces                                                         | `apiKey`
`GET`   | <code class="users">/user/removed-spaces</code>         | Get spaces removed by the authenticating user                                           | `apiKey`
`GET`   | <code class="users">/user/current-public-spaces</code>  | Get a list of all users currently viewing or editing spaces with privacy set to `open`  | None
`PATCH` | <code class="users">/user</code>                        | Update the authenticating user(s) based on an object body with user attributes. You can't patch `apiKey`, `password`, `emailIsVerified`, or `email` | `apiKey`
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
defaultConnectionTypeId | `String`  | The last connectionTypeId that the user marked as 'Default' to use for new connections
lastReadNewStuffId      | `String`  | The id of the last read article from the 'new stuff' newsfeed
currentPublicSpaceId    | `String`  | The id of an space with privacy set to 'open' that the user is currently viewing or editing


<a name="spaces"></a>
<h2 class="spaces">Spaces</h2>

Spaces are where you create cards and connections. You can edit and create spaces with the same abilities that a real human has.

.auth explain.... Routes with Auth as `apiKey` mean that the Authorization header apiKey must match the requested user.
canViewSpace
canEditSpace
isUser

<h3 class="spaces">Space Routes</h3>

Method | Path | Description | Auth
--- | --- | --- | ---
`GET`    | <code class="spaces">/space/:spaceId</code>              | Get info on a space by id                                                            | `canViewSpace`
`GET`    | <code class="spaces">/space/new-spaces</code>            | Get a list of recently updated spaces which are open or closed and have been renamed | None
`GET`    | <code class="spaces">/space/:spaceId/<br>removedCards</code> | Get cards removed in a space                                                         | `canEditSpace`
`GET`    | <code class="spaces">/space/by-url/:spaceUrl</code>      | Get info on a space by space url format (name-id)                                    | `canViewSpace`
`POST`   | <code class="spaces">/space</code>                       | Create a new space(s) from object(s) in request body                                 | `isUser`
`PATCH`  | <code class="spaces">/space</code>                       | Update space(s) from object(s) in request body                                       | `canEditSpace`
`PATCH`  | <code class="spaces">/space/restore</code>               | Restore removed space(s)  from object(s) in request body                             | `canEditSpace`
`PATCH`  | <code class="spaces">/space/collaborator</code>          | Adds the userId to the spaceId using the collaboratorKey specified in the request body. Request Body Keys: `collaboratorKey`, `spaceId`, `userId` | `spaceCollaboratorKey`
`DELETE` | <code class="spaces">/space</code>                       | Remove space(s) specified in request body                                            | `canEditSpace`
`DELETE` | <code class="spaces">/space/permanent</code>             | Permanently remove space(s) specified in request body                                | `canEditSpace`
`DELETE` | <code class="spaces">/space/collaborator</code>          | Removes collaborator user from space. Request Body Keys: `spaceId`, `userId`                              | `canEditSpace`

<h3 class="spaces">Space Attributes</h3>

Name | Type | Description
--- | --- | ---
id                  | `String` | The unique ID of the space. Is not user updateable
name                | `String` | The name of the space. Is a url-safe string (no spaces or special characters) because it's also used for url slugs
url                 | `String` | The url of a space is determined by it's `name` and `id`. For example, `kinopio.club/:space-name-:id`
ownerUserId         | `String` | The userId of the user who created the space. Used to create url slugs. In the future ownership will be transferable
Privacy             | `String` | Can be `open`, `closed`, `private`
isRemoved           | `Boolean` | Sets whether the space has been soft-removed. (can then be restored or permanently removed)
removedByUserId     | `String` | "The user who soft-removed the space. All space users can restore it via the API, but only the user who removed it will see it listed"
collaboratorKey     | `String` | "kinda like an apikey but just for that space. allows anonymous users who aren't signed in to edit a space. You can rotate this key, but you should still treat it as a secret"
collaborators       | `Array` | List of users added to space as collaborators
users               | `Array` | the user who created/owns the space (a space will always have only one user)
collaborators       | `Array` | a list of users that can also edit the space


