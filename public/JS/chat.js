const socket = io()

//Elements
const messageform = document.querySelector('#form1')
const forminput = messageform.querySelector('input')
const formbutton = messageform.querySelector('button')
const chat = document.querySelector("#chat")
const loc = document.querySelector('#loc')

const {Name,Room} = Qs.parse(location.search, {ignoreQueryPrefix : true})

//Template

const htm = document.querySelector('#temp').innerHTML
const locatehtm = document.querySelector('#sendloc').innerHTML
const list = document.querySelector('#list').innerHTML



const autoscroll = () => {
//last message
const lastmes = chat.lastElementChild

//calculate message height

const messoff = lastmes.offsetHeight
const mar = getComputedStyle(lastmes).marginBottom
const marint = parseInt(mar)
const mesheight = messoff + marint
console.log('mesheight',mesheight)

//Scroll bar logic

const sb = chat.offsetHeight
const param1  = chat.scrollTop +sb
console.log('sb+st',param1)

//container height

const ch = chat.scrollHeight
console.log('ch',ch)

if(ch-mesheight <= param1){
    chat.scrollTop = chat.scrollHeight
}

}

socket.on('newMessage', message => {
    const newhtm = Mustache.render(htm, {
        Name : message.Name,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm:ss a')
    })
    chat.insertAdjacentHTML("beforeend",newhtm)
    autoscroll()
    
})

socket.on('locationmessage', message => {
    const locate = Mustache.render(locatehtm,{
        Name : message.Name,
        myurl : message.url,
        createdAt: moment(message.createdAt).format('h:mm:ss a')
    })
    chat.insertAdjacentHTML("beforeend",locate)
    autoscroll()
})

socket.on('roomdata', ({room,users}) => {
const listhtm = Mustache.render(list, {
    room,
    users
})


 document.querySelector('#sidebar').innerHTML = listhtm
})

messageform.addEventListener('submit', (e) => {
    e.preventDefault()
    //disable
    formbutton.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {

        //enable
        formbutton.removeAttribute('disabled')
        forminput.value = ""
        forminput.focus()

        if(error){
           return console.log(error)
        }
        console.log('Mesage delivered!')
    })
})

loc.addEventListener('click', ()=> {

    if(!navigator.geolocation){
        return alert('Location is not supported by the browser')
    }
    
    loc.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition( (position) => {
        socket.emit('sendlocation', {lat : position.coords.latitude, lon : position.coords.longitude}, (text) => {
            loc.removeAttribute('disabled')
            console.log(text)
        })
    })
})


socket.emit('join', {Name,Room}, (error) => {
    if(error) {
    alert(error)
    location.href = '/'
}
})
// socket.on('countUpdated', count => {
//     console.log('Latest value of count is ', count)
// })

// document.querySelector('#inc').addEventListener('click', () => {
//     console.log('Clicked!')
//     socket.emit('increment')
// })