const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = () => {
    //new message element
    const $newMessage = $messages.lastElementChild
    //Height of new message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    //visibleHeight
    const visibleHeight = $messages.offsetHeight
    //container Height
    const containerHeight = $messages.scrollHeight
    //how much i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message',(message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('LT')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(message) => {
    console.log(message)
    const html = Mustache.render(locationTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('LT')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users}) => {
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit',(e) => {
    e.preventDefault()
    //disable
    $messageFormButton.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error) => {
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})


$sendLocationButton.addEventListener('click',() => {
    if(!navigator.geolocation){
        return alert('Geolocation is not suppported by your browser')
    }

    //disable
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendLocation',{
            latitude : position.coords.latitude,
            longitude :position.coords.longitude
        },() => {
            //enable
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared!')
        })
    })
})
socket.emit('join',{username,room},(error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})