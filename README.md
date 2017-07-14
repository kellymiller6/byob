[![CircleCI](https://circleci.com/gh/kellymiller6/byob.svg?style=svg)](https://circleci.com/gh/kellymiller6/byob)

# BYOB - Creating an API of Sports Illustrated Covers from 2015-July 2017

### [Hosted on Heroku](https://km-build-your-own-backend.herokuapp.com/)
#### Using nightmare I scraped [Sports Illustrated](https://www.si.com)
* I created an api of Sports Illustrated Covers. I created the data through webscraping and data
entry using excel. The idea is to use this api for visualizing sports popularity and trends.

[POST - /api/v1/sports](https://github.com/kellymiller6/byob/blob/master/server.js#L54-L68)
* Adds a new sport to database. Authorized Endpoint.

[POST - /api/v1/covers](https://github.com/kellymiller6/byob/blob/master/server.js#L70-L84)
* Adds a new cover to the database. Authorized Endpoint.

[PATCH - /api/v1/covers/id/:id](https://github.com/kellymiller6/byob/blob/master/server.js#L86-L97)
* Edits a cover selected by it's ID. Authorized Endpoint.

[PATCH - /api/v1/sports/id/:id](https://github.com/kellymiller6/byob/blob/master/server.js#L99-L110)
* Edits a sport selected by it's ID Authorized Endpoint.

[DELETE - /api/v1/covers/id/delete/:id](https://github.com/kellymiller6/byob/blob/master/server.js#L112-L125)
* Deletes a cover by it's ID. Authorized Endpoint.

[DELETE - /api/v1/covers/date/delete/:date](https://github.com/kellymiller6/byob/blob/master/server.js#L127-L140)
* Deletes a cover by it's date. Authorized Endpoint.

[GET - /api/v1/sports/](https://github.com/kellymiller6/byob/blob/master/server.js#L142-L152)
* Gets all sports.

[GET - /api/v1/sports/id/:id](https://github.com/kellymiller6/byob/blob/master/server.js#L154-L164)
*  Gets all sports by specified ID.

[GET - /api/v1/sports/sport/:sport](https://github.com/kellymiller6/byob/blob/master/server.js#L166-L177)
* Gets all sports by specified sport name.

[GET - /api/v1/covers/](https://github.com/kellymiller6/byob/blob/master/server.js#L179-L189)
* Gets all covers.

[GET - /api/v1/covers/date/:date](https://github.com/kellymiller6/byob/blob/master/server.js#L191-L201)
* Gets all covers by specified date.

[GET - /api/v1/covers/id/:id](https://github.com/kellymiller6/byob/blob/master/server.js#L203-L213)
* Gets all covers by specified ID.

[GET - /api/v1/sports/id/:sport_id/covers](https://github.com/kellymiller6/byob/blob/master/server.js#L215-L225)
* Gets all covers for a sport specified by the sports ID.

[GET - /api/v1/sports/sport/:sport/covers](https://github.com/kellymiller6/byob/blob/master/server.js#L227-L237)
* Gets all covers for a sport specified by the sports name.
