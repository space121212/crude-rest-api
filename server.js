var app = require('./index')
const port = process.env.port || 8080

// app.use('/',(req,res)=>{
//     res.send('hello fellas, this  server is working!')
// })

app.listen(port,()=>{
    console.log(' working fine with port '+ port)
})