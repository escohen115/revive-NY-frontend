const baseUrl = "https://shrouded-fortress-01276.herokuapp.com/api/v1"
const businessesURL = `${baseUrl}/businesses`
const investmentsUrl = `${baseUrl}/investments`
const userUrl = `${baseUrl}/users`
const businessInfoDiv = document.querySelector('div#business-info')
const statsDiv = document.querySelector('div#fundraising-stats')
const moreBizBtn = document.querySelector('button#more-biz-btn')
const showDiv = document.querySelector('div#show-div')
const signUpButton = document.querySelector('li#sign-up')
const lendLi = document.querySelector('li#lend')
const signInButton = document.querySelector('li#sign-in')
const allBizDiv = document.querySelector('div#all-biz-div')
const investmentsLi = document.querySelector('li#investments')
const signOutButton = document.querySelector("li#sign-out")
const signUpForm = document.querySelector("#sign-up-form")
const projectDescription = document.querySelector("#project-description")
const logoLi = document.querySelector('li#logo') 


//renderOneInvestment
const fetchHeaders = {
    Accept: "application/json",
     "Content-Type": "application/json",
    }

let currentUser = {id: -1}

let numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

let showPageFromListener = (event) => {
    
    if (event.target.matches('button.learn_more')) 
    {
        toggleOff(businessInfoDiv)
      let id = event.target.closest("div").dataset.id

      fetch(`${businessesURL}/${id}`)
        .then((response) => response.json())
        .then((business) => renderBusinessPage(business))
    }

}

let fetchUserInvestments = () => {

    fetch(`${userUrl}/${currentUser.id}`)
        .then(r => r.json())
        .then(user => user.investments.forEach(renderOneInvestment))
}

let fetch5Businesses = (url) => {
    fetch(url)
    .then(r => r.json())
    .then(data => (data.slice(0, 5)).forEach(renderBusinessToInfoDiv))
}

let fetchTotalInvestmentData = (url) => {
    fetch(url)
    .then(r => r.json())
    .then(data => console.log(data))
}



let renderBusinessToInfoDiv = (business) => {

    // debugger 
    //toggleOff(investmentsLi)
    let oneBizDiv = document.createElement('div')
    oneBizDiv.dataset.id = business.id
    oneBizDiv.classList.add('one-biz')

    let imgDiv = document.createElement('div')
    imgDiv.classList.add('one-biz-img')

    let oneBizImg = document.createElement('img')
    oneBizImg.src = business.picture
    oneBizImg.alt = business.name

    let oneBizP = document.createElement('p')
    oneBizP.textContent = business.description
    // oneBizDivP.classList.add('biz-p')

    let oneBizH4 = document.createElement('h4')
    oneBizH4.textContent = business.name

    let oneBizBtn = document.createElement('button')
    oneBizBtn.classList.add('learn_more') 
    oneBizBtn.innerText = 'Learn More'

    let wordsDiv = document.createElement('div')
    wordsDiv.classList.add('words')

    imgDiv.append(oneBizImg)
    wordsDiv.append(oneBizH4, oneBizP)
    oneBizDiv.append(imgDiv, wordsDiv, oneBizBtn)
    businessInfoDiv.append(oneBizDiv)
}

businessInfoDiv.addEventListener('click', showPageFromListener)


let renderInvestmentToBusinessShow = investment => {
    // debugger 

    let allInvestmentsDiv = document.querySelector('div#investments')

    let oneInvestmentDiv = document.createElement('div')

    let descriptionH4 = document.createElement('h4')
    descriptionH4.textContent = `Investment amount: $${numberWithCommas(investment.amount)}`

    let descriptionP = document.createElement('p')
    descriptionP.textContent = investment.description

    let nameP = document.createElement('p')

    oneInvestmentDiv.append(descriptionH4, descriptionP, nameP)
    allInvestmentsDiv.append(oneInvestmentDiv)

    fetch(`${userUrl}/${investment.userId}`)
        .then(r => r.json())
        .then(user => nameP.textContent = `-From ${user.name} ❤️`)

}

let renderBusinessPage = (business) => 
{
    toggleOff(projectDescription)
    toggleOn(showDiv)
    toggleOff(allBizDiv)

    showDiv.innerHTML =
    `
    <div id="show-image"> 
        <img  id="profile-image" src=${business.picture} alt=${business.name}>
    </div> 
    <div id="progress-status">
        <h2>$${numberWithCommas(business.goal)} Goal</h2>
        <h3>$${numberWithCommas(business.moneyMade)} raised</h3>
        
        <div id='progress-holder'>
            <div id='progress-bar'> </div>
        </div>
        <h4>${Math.round(business.percentFunded)}% funded<h4>

        <h4 id='to-go'>$${numberWithCommas(business.goal - business.moneyMade)} to go.</h4>
    </div> 
    <div id="invest"> 
        <h2>${business.name}</h2>
        <h3>Industry: ${business.industry}</h3>
        
        <div id='pledge-form-div'>
        </div>
        
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
    </div>
    `

    let toGoH4 = document.querySelector('#to-go')

    if (business.moneyMade >= business.goal) {
        toGoH4.textContent = 'This business has reached its goal!'
    }

    if (currentUser.id > 0)
    {
        let pledgeFormDiv = document.querySelector('#pledge-form-div')
            pledgeFormDiv.innerHTML = 
            `
            <h4>Make A Pledge</h4>
            <form data-id="${business.id}" id="pledge-form">

                <label for="description">Description:</label><br>
                <input type="text" id="description" name="description"><br>

                <label for="pledge">Lend:</label><br>
                <input type="text" id="pledge" name="pledge"><br>


                <button type="submit" class='pledge-button' value = "Submit">Pledge</button>

            </form>
            `
            const pledgeForm = document.querySelector("#pledge-form")

            pledgeForm.addEventListener("submit", (event) => {
              event.preventDefault()

              let id = event.target.dataset.id
              //debugger
            if (event.target.pledge.value == 0) {
                alert('Amount must be more than zero!')
            }
            else if (event.target.pledge.value > (business.goal - business.moneyMade))
            {
                alert('Amount may not exceed remaining goal')
            }
            else  
            {
                alert('Thank you for your donation!')
                let investmentObj = {
                    amount: event.target.pledge.value,
                    business_id: id,
                    user_id: currentUser.id,
                    description: event.target.description.value,
                }

                let confObj = {
                    method: "POST",
                    headers: {
                    Accept: "application/json",
                     "Content-Type": "application/json",
                    },
                    body: JSON.stringify(investmentObj),
                }
            
            
              fetch(`${investmentsUrl}`, confObj)
              .then(response => response.json())
              .then(data => experimentalFunctionCall(data.businessId))
            }
            event.target.reset()
            
            })    

    } 


    const progressBar = document.querySelector('div#progress-bar')
    
    if (business.percentFunded < 100) {
    progressBar.style.width = `${business.percentFunded}%`
    } else {
        progressBar.style.width = "100%"
    }

    business.investments.forEach(renderInvestmentToBusinessShow)
}

let toggleOn = (element) => {
    if (element === showDiv) {
        element.style.display = 'grid'
    }
    else {
        element.style.display = 'block'
    }
}

let toggleOff  = (element) => {
    element.style.display = 'none'
}

let renderAllBusinesses = (business) => {

    toggleOff(businessInfoDiv)

    allBizDiv.innerHTML += 
    `<div class='individual' data-id=${business.id}>
        <div class='all-biz-img' data-id=${business.id}>
            <img src=${business.picture} alt=${business.name}>
        </div>  
        <h4>${business.name}</h4>
        <p>${business.description}</p>
        <button class="learn_more">Learn More</button>
    </div>
    `

    let learnMoreBtn = document.querySelector('button.learn_more')

    allBizDiv.style.display = 'grid'
    // learnMoreBtn.addEventListener('click', () => console.log('clicked'))
}

allBizDiv.addEventListener('click', showPageFromListener)

        
moreBizBtn.addEventListener('click', evt => {
    // businessInfoDiv.innerHTML= ''
    toggleOff(showDiv)
    toggleOff(signUpForm)

    // fetch(`${businessesURL}`)
    // .then(response => response.json())
    // .then(businesses => businesses.forEach(renderAllBusinesses))
    if (allBizDiv.children.length > 0 && allBizDiv.style.display === 'none') {
        toggleOn(allBizDiv)
    } 
    else if (allBizDiv.children.length > 0) {
        alert('No more businesses to view!')
    }
    else {        
    fetchAllBusinesses()
    }

    // toggleOff(moreBizBtn)
    
})

let fetchAllBusinesses = () => {
    
    fetch(businessesURL)
    .then(response => response.json())
    .then(businesses => businesses.forEach(renderAllBusinesses))

}

// showMore

signUpButton.addEventListener("click", (event) => {
    event.preventDefault()

  toggleOff(businessInfoDiv)
  toggleOff(signUpButton)
  toggleOn(signInButton)
  toggleOn(showDiv)

  showDiv.innerHTML = 
  `<form data-id="${2}" id="sign-up-form">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name"><br>

        <label for="email">Email:</label><br>
        <input type="text" id="email" name="email"><br>

        <button type="submit" value = "submit">Create an Account</button>
    </form>`

  let signUpForm = document.querySelector("#sign-up-form")
  signUpForm.addEventListener("submit", (event) => {
    event.preventDefault()

    let userObj = {
      name: event.target.name.value,
      email: event.target.email.value,
    }

    let confObj = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObj),
    }

    fetch(`${baseUrl}/users`, confObj)
      .then((response) => response.json())
      .then((data) => {
        currentUser = data
        if (currentUser.status != 422) {
            alert(`hello ${currentUser.name}! thanks for signing up!`)
            toggleOff(signInButton)
            toggleOn(investmentsLi)
            
            toggleOn(businessInfoDiv)
            businessInfoDiv.style.display = 'inline-flex'           
            // toggleOff(pledgeFormDiv)

            toggleOff(showDiv) 
            toggleOn(signOutButton)

            // fetch5Businesses(businessesURL)

            // toggleOff(allBizDiv)
            // toggleOn(businessInfoDiv)
            // toggleOff(showDiv)


    // toggleOn(allBizDiv)
    // toggleOn(businessInfoDiv)
    // toggleOff(showDiv)

        }
        else 
        {
          alert("email taken")
        }
      })
  })
})




signInButton.addEventListener("click", function (event) {
    event.preventDefault()
    toggleOn(signUpButton)
    toggleOff(signInButton)
    toggleOff(businessInfoDiv)
    toggleOn(showDiv)
    toggleOff(allBizDiv)
    
    showDiv.innerHTML = 
    `<form id="sign-in-form">

            <label for="email">Email:</label><br>
            <input type="text" id="email" name="email"><br>

            <button type="submit" value = "submit">Sign In</button>

    </form>`

    let signInForm = document.querySelector("#sign-in-form")
    signInForm.addEventListener("submit", (event) => {

   //  lendAndLogoEvent(event)

    event.preventDefault()


    let userObj = {
    name: event.target.name.value,
    email: event.target.email.value,
    }

    let confObj = {
    method: "POST",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    body: JSON.stringify(userObj),
    }

    fetch(`${baseUrl}/users/sign_in`, confObj)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        currentUser = data
        if (currentUser)
        {
            alert(`hello ${currentUser.name}! thanks for signing in!`)
            toggleOff(signInButton)
            toggleOff(signUpButton)
            toggleOn(signOutButton)
            toggleOn(investmentsLi)
            toggleOff(signInForm)

            toggleOn(businessInfoDiv) 
            businessInfoDiv.style.display = 'inline-flex'           
            toggleOff(showDiv)
        }
        else
        {
            alert('User not found. Please try again')
        } 
      })
    })


})

let lendAndLogoEvent = (event) => {
    event.preventDefault()

    if (signedIn(currentUser) === false)
    {
        toggleOn(signInButton)
        toggleOn(signUpButton)
    }

    toggleOn(projectDescription)
    
    toggleOff(showDiv)
    toggleOff(businessInfoDiv)

    toggleOn(allBizDiv)

    if (allBizDiv.children.length > 0 && allBizDiv.children.length <= 15) {
     toggleOn(allBizDiv)
     allBizDiv.style.display = 'grid'
    } 
    else 
    {
    fetchAllBusinesses()
    }  // fetch5Businesses(bus(bsinessesURL)

}


lendLi.addEventListener('click', lendAndLogoEvent)

logoLi.addEventListener('click', function(event)  {
    lendAndLogoEvent (event)
})








let fetchUpdatedInvestment = (investmentConfigObj, id) => {
    fetch(`${investmentsUrl}/${id}`, investmentConfigObj)
        .then(r => r.json())
        .then(investment => console.log(investment))
}

let updateInvestment = evt => {
    evt.preventDefault()

    investmentDescription = evt.target.description.value
    investmentAmount = evt.target.amount.value
    investmentId = evt.target.id
//    console.log(evt.target.id)
    let investmentFormObj = {
        investment_id: investmentId,
        description: investmentDescription,
        amount: investmentAmount
    }

    let investmentConfigObj = {
        method: 'PATCH', 
        headers: fetchHeaders,
        body: JSON.stringify(investmentFormObj)
    }

    fetchUpdatedInvestment(investmentConfigObj, investmentId)
    // fetchUserInvestments()
}




let renderOneInvestment = (investment) => {

    // debugger 

    newDiv = document.createElement('div')
    newDiv.dataset.id = investment.id
    let stringDescription = investment.description.toString()
    

    newDiv.innerHTML = 
    `<h3>${investment.business.name}</h3>
    <form id=${investment.id}>

        <label for="amount">Amount:</label>
        <input type="number" name="amount" value=${investment.amount}><br>
        
        <label for="description">Description:</label>
        <input type="text" name="description" value='${stringDescription}'>
        
        <button class='update-button' type="submit" value="submit">Update</button>
    </form>
    `
    let deleteButton = document.createElement("button")
    deleteButton.textContent = "Delete"

    // debu
    deleteButton.classList.add('delete-button')
    deleteButton.dataset.id = investment.id

    deleteButton.addEventListener('click', deleteInvestment)

    newDiv.append(deleteButton)
    investmentsDiv.append(newDiv)

    let formDescription = document.querySelectorAll('input')[1]
    formDescription.value = stringDescription

    let updateInvestmentForm = document.querySelector("form#" + CSS.escape(investment.id))

    updateInvestmentForm.addEventListener('submit', updateInvestment)
    
    // else {
    //     newDiv.innerHTML = 
    //     `<h2>You have no investments yet!<h2>`
    // }
}




investmentsLi.addEventListener("click", (event) => {
    event.preventDefault()
    showDiv.innerHTML = ''
    toggleOff(projectDescription)
    toggleOff(businessInfoDiv)
    toggleOn(showDiv)
    toggleOff(allBizDiv)
    
    let titleDiv = document.createElement('div')
    titleDiv.id = 'investments-title'
    let h2 = document.createElement("h2");
    h2.textContent = `${currentUser.name}'s investments:`;

    titleDiv.append(h2)

    investmentsDiv = document.createElement('div')
    investmentsDiv.id = 'investments-container'

    showDiv.append(titleDiv, investmentsDiv);

    fetchUserInvestments()
    // currentUser.investments.forEach(renderOneInvestment)

})



signOutButton.addEventListener('click', event => {
    if (confirm("Are you sure you'd like to sign out?") == true){ 
    currentUser.id = -1
    toggleOff(signOutButton)
    toggleOn(signInButton)
    toggleOn(signUpButton)
    toggleOff(investmentsLi)
    toggleOn(allBizDiv)
    toggleOn(businessInfoDiv)
    toggleOff(showDiv)
    }
})

function deleteInvestment (event) {
    if (confirm("Are you sure you'd like to delete this investment?") == true)
{
    fetch(`${investmentsUrl}/${event.target.dataset.id}`, {
    method: "DELETE",
    })
    event.target.parentElement.remove()}

}



function signedIn (currentUser){
    if (currentUser.id > 0 )
    {
        return true
    }
    else
    {
        return false
    }
    
}



// deleteBtn.addEventListener('click', evt )

toggleOff(signOutButton)
toggleOff(investmentsLi)

fetch5Businesses(businessesURL)
// fetchTotalInvestmentData(investmentsUrl)




function experimentalFunctionCall (businessId){
    fetch(`${businessesURL}/${businessId}`)
    .then((response) => response.json())
    .then((business) => renderBusinessPage(business))
}


