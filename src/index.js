const baseUrl = "http://localhost:3000/api/v1"
const businessesURL = `${baseUrl}/businesses`
const investmentsUrl = `${baseUrl}/investments`
const businessInfoDiv = document.querySelector('div#business-info')
const statsDiv = document.querySelector('div#fundraising-stats')
const moreBizBtn = document.querySelector('button#more-biz-btn')
const showDiv = document.querySelector('div#show-div')
const signUpButton = document.querySelector('button#sign-up')
const mockUserId = 25
// const current_user 


let fetchAllBusinesses = (url) => {
    fetch(url)
    .then(r => r.json())
    .then(data => (data.slice(0, 5)).forEach(renderBusinessToInfoDiv))
}

let fetchInvestmentData = (url) => {
    fetch(url)
    .then(r => r.json())
    .then(data => console.log(data))
}


let renderBusinessToInfoDiv = (business) => {
    // debugger 
    let oneBizDiv = document.createElement('div')
    oneBizDiv.dataset.id = business.id

    // toggleDisplay(showDiv)

    imgDiv = document.createElement('div')
    
    oneBizImg = document.createElement('img')
    oneBizImg.src = business.picture
    oneBizImg.alt = business.name

    oneBizP = document.createElement('p')
    oneBizP.textContent = business.description

    oneBizH4 = document.createElement('h4')
    oneBizH4.textContent = business.name

    oneBizBtn = document.createElement('button')
    oneBizBtn.classList.add('learn_more') 
    oneBizBtn.innerText = 'Learn More'

    imgDiv.append(oneBizImg)
    oneBizDiv.append(imgDiv, oneBizH4, oneBizP, oneBizBtn)
    businessInfoDiv.append(oneBizDiv)
}

businessInfoDiv.addEventListener('click', event => {

    if (event.target.matches('.learn_more')) 
    {
        let id = event.target.closest('div').dataset.id
        
        fetch(`${businessesURL}/${id}`)
        .then(response => response.json())
        .then(business => renderBusinessPage(business))
    }

})


let renderBusinessPage = (business) => 
{
    toggleDisplay(businessInfoDiv)
    toggleDisplay(moreBizBtn)

    // let name = document.createElement('h1')
    // name.textContent = business.name

    // let imgDiv = document.createElement('div')
    // let picture = document.createElement('img') 
    // picture.src = business.picture

    // showDiv.append(name)
    // showDiv.append(picture)

    showDiv.innerHTML =
    `<div id="show-image"> 
        <img  id="profile-image" src=${business.picture} alt=${business.name}>
    </div> 
    <div id="progress-status">
        <h3>${Math.round(business.percentFunded)} Percent funded<h3>
        <div id='progress-bar'> </div> 
    </div> 
    <div id="invest"> 
        <h2>${business.name}</h2>
        <h3>${business.industry}</h3>
        <h4>Make A Pledge</h4>
        <form data-id="${business.id}" id="pledge-form">

            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name"><br>

            <label for="pledge">Pledge:</label><br>
            <input type="text" id="pledge" name="pledge">

            <label for="description">Description:</label><br>
            <input type="text" id="description" name="description">

            <button type="submit" value = "Submit">Submit</button>
        </form>
    </div> 
    <div id="description">
        <h4>${business.name}'s story</h4>
        <p>${business.description}</p> 
    </div> 
    <div id="investments"> 
        
    </div> 
    <div id="more-info">
        <ul id='contact-list'> 
            <li> ${business.address} </li>
            <li> ${business.phoneNumber} </li>
            <li> ${business.website} </li>
        </ul>
    </div>`
    
    const progressBar = document.querySelector('div#progress-bar')
    
    if (business.percentFunded < 100) {
    progressBar.style.width = `${business.percentFunded}%`
    } else {
        progressBar.style.width = "100%"
    }

    const pledgeForm = document.querySelector('#pledge-form')
    
    pledgeForm.addEventListener('submit', event => {
        
        event.preventDefault()

        let id = event.target.dataset.id


        let investmentObj = 
        {
            amount: event.target.pledge.value,
            business_id: id,
            user_id: mockUserId,
            description: event.target.description.value

        }

        let confObj = 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(investmentObj)
        }
        
        fetch(`${investmentsUrl}`, confObj)

    } )    
    
}

let toggleDisplay = (element) => {
    if (element.style.display === 'none') {
        element.style.display = 'block'
    } else {
        element.style.display = 'none'
    }
}

moreBizBtn.addEventListener('click', evt => {
    fetch(`${businessesURL}`)
    .then(response => response.json())
    .then(businesses => businesses.slice(5).forEach(renderBusinessToInfoDiv))
    
})

signUpButton.addEventListener('click', event => {
    event.preventDefault
    toggleDisplay(businessInfoDiv)
    showDiv.innerHTML =
    `<form data-id="${2}" id="sign-up-form">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name"><br>

        <label for="email">Email:</label><br>
        <input type="text" id="email" name="email"><br>

        <button type="submit" value = "submit">Create an Account</button>
    </form>`
    
    let signUpForm = document.querySelector('#sign-up-form')
    signUpForm.addEventListener('submit', event => {
        
    let userObj = 
    {
        name: event.target.name.value,
        email: event.target.email.value
    }

    let confObj = 
    {
        method: 'POST',
        headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userObj)
    }

    fetch(`${baseUrl}/users`, confObj)
    
    // .then(response => response.json())
    // .then(data => {
    //     current_user = data
    // })
    
    })
})
    

fetchAllBusinesses(businessesURL)
fetchInvestmentData(investmentsUrl)


