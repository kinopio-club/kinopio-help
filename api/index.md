---
title: API Docs
color: '#d3badf'
layout: "layouts/api.pug"
---
<img src="/assets/cat.png" class="cat no-shadow"/>

The Kinopio API is used to find, save, and update the spaces of signed up users. You can use it to make cool things too.

(*・_・)⊃══✫⌒*･ﾟ✲

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

### User Routes

Method | Name | Description | Auth
--- | --- | --- | ---
`GET` | <code class="users">/user/public/:userId</code> | Get public info on a user JSON.parse(localStorage.user).id | None
`GET` | <code class="users">/user</code> | Get all info on the authenticating user | `apiKey`
`GET` | <code class="users">/user/favorites</code> | Gets all info, including user and space favorites, on the authenticating user | `apiKey`
`GET` | <code class="users">/user/spaces</code> | get a list of the user's spaces | `apiKey`
`GET` | <code class="users">/user/removed-spaces</code> | Get spaces removed by the authenticating user | `apiKey`
`GET` | <code class="users">/user/current-public-spaces</code> | get a list of all users currently viewing or editing spaces with privacy set to `open` | None
`PATCH` | <code class="users">/user</code> | Update the authenticating user(s) based on object body. You can't patch `apiKey`, `password`, `emailIsVerified`, or `email` | `apiKey`
`PATCH` | <code class="users">/user/favorites</code> | Add or remove favorite users or spaces. Acts like a toggle, if the user is already liked it then removes the like. If not already liked it adds the like. request body should be in the format. | `apiKey`
