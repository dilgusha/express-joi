export default {
    port: process.env.PORT,
    jwtSecret: process.env.SECRET_KEY,
    mongoUrl: process.env.MONGO_URL,
    refreshSecret: process.env.REFRESH_SECRET_KEY,
    clientBaseUrl: process.env.CLIENT_URL
}




// # User:
// # •	Yeni user əlavə edin: POST /users
// # •	Bütün userleri gör: GET /users
// # •	useri sil: DELETE /users/:id
// # •	user edit: PUT /users/:id
// # •	user todos: GET /users/:userId/all-todos
// # •	user completed todos: GET /users/:userId/todos?completed=true


// # To-Do:
// # Hər bir todo bir user-e aid olacaq.
// # •	Yeni todo əlavə edin: POST /users/:userId/todos
// # •	Bütün todo-lari gör: GET /users/:userId/todos
// # •	Todo edit: PUT /users/:userId/todos/:todoId
// # •	Todo sil: DELETE /users/:userId/todos/:todoId
// # •	Todos(bir user-e aid butun todoslari) sil: DELETE /users/:userId/todos

// # users:
// {
//   "_id": "unique_user_id",
//   "name": "User adı",
//   "email": "email@example.com",
//   "todos": ["todo_id_1", "todo_id_2"]
// }

// # todos
// {
//   "_id": "unique_todo_id",
//   "userId": "user_id",
//   "task": "Todo text",
//   "completed": false,
//   "createdAt": "2024-12-09T10:00:00Z"
// }


