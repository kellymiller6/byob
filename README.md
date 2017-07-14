[![CircleCI](https://circleci.com/gh/kellymiller6/byob.svg?style=svg)](https://circleci.com/gh/kellymiller6/byob)

# BYOB - Creating an API of Sports Illustrated Covers from 2015-July 2017

### [Hosted on Heroku](https://km-build-your-own-backend)
#### Using nightmare I scraped [Sports Illustrated](https://www.si.com)
* I created an api of Sports Illustrated Covers. I created the data through webscraping and data
entry using excel. The idea is to use this api for visualizing sports popularity and trends.

[POST - /api/v1/sports Adds a new sport to database. Authorized Endpoint.](https://github.com/kellymiller6/byob/blob/master/server.js#L54-L68)


[POST - /api/v1/covers Adds a new cover to the database. Authorized Endpoint.](https://github.com/kellymiller6/byob/blob/master/server.js#L70-L84)


[PATCH - /api/v1/covers/id/:id Edits a cover selected by it's ID. Authorized Endpoint.](https://github.com/kellymiller6/byob/blob/master/server.js#L86-L97)


[PATCH - /api/v1/sports/id/:id Edits a sport selected by it's ID Authorized Endpoint.](https://github.com/kellymiller6/byob/blob/master/server.js#L99-L110)


[DELETE - /api/v1/covers/id/delete/:id Deletes a cover by it's ID. Authorized Endpoint.](https://github.com/kellymiller6/byob/blob/master/server.js#L112-L125)

[DELETE - /api/v1/covers/date/delete/:date Deletes a cover by it's date. Authorized Endpoint.](https://github.com/kellymiller6/byob/blob/master/server.js#L127-L140)

[GET - /api/v1/sports/ Gets all sports.](https://github.com/kellymiller6/byob/blob/master/server.js#L142-L152)

[GET - /api/v1/sports/id/:id Gets all sports by specified ID.](https://github.com/kellymiller6/byob/blob/master/server.js#L154-L164)

[GET - /api/v1/sports/sport/:sport Gets all sports by specified sport name.](https://github.com/kellymiller6/byob/blob/master/server.js#L166-L177)

[GET - /api/v1/covers/ Gets all covers.](https://github.com/kellymiller6/byob/blob/master/server.js#L179-L189)

[GET - /api/v1/covers/date/:date Gets all covers by specified date.](https://github.com/kellymiller6/byob/blob/master/server.js#L191-L201)

[GET - /api/v1/covers/id/:id Gets all covers by specified ID.](https://github.com/kellymiller6/byob/blob/master/server.js#L203-L213)

[GET - /api/v1/sports/id/:sport_id/covers Gets all covers for a sport specified by the sports ID.](https://github.com/kellymiller6/byob/blob/master/server.js#L215-L225)

[GET - /api/v1/sports/sport/:sport/covers Gets all covers for a sport specified by the sports name.](https://github.com/kellymiller6/byob/blob/master/server.js#L227-L237)
