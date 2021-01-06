const baseUrl = "http://localhost:3000/api/v1"
const businessesURL = `${baseUrl}/businesses`
const investmentsUrl = `${baseUrl}/investments`
const businessInfoDiv = document.querySelector('div#business-info')
const statsDiv = document.querySelector('div#fundraising-stats')
const moreBizBtn = document.querySelector('button#more-biz-btn')
const showDiv = document.querySelector('div#show-div')
const signUpButton = document.querySelector('li#sign-up')
const lendLi = document.querySelector('li#lend')
const signInButton = document.querySelector('li#sign-in')
const allBizDiv = document.querySelector('div#all-biz-div')
let signUpForm = document.querySelector("#sign-up-form")


const mockUserId = 25
let currentUserId = 0


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
        toggleOff(businessInfoDiv);
      let id = event.target.closest("div").dataset.id;

      fetch(`${businessesURL}/${id}`)
        .then((response) => response.json())
        .then((business) => renderBusinessPage(business));
    }

})

let showPagefromListener = (event) => {
    
}


let renderBusinessPage = (business) => 
{
    
    toggleOn(showDiv)

    // let name = document.createElement('h1')
    // name.textContent = business.name

    // let imgDiv = document.createElement('div')
    // let picture = document.createElement('img') 
    // picture.src = business.picture

    // showDiv.append(name)
    // showDiv.append(picture)

    showDiv.innerHTML = `<div id="show-image"> 
        <img  id="profile-image" src=${business.picture} alt=${business.name}>
    </div> 
    <div id="progress-status">
        <h3>${Math.round(business.percentFunded)} Percent funded<h3>
        <div id='progress-bar'> </div> 
    </div> 
    <div id="invest"> 
        <h2>${business.name}</h2>
        <h3>${business.industry}</h3>
        
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
    </div>`

    if (currentUserId > 0)
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


                <button type="submit" value = "Submit">Pledge</button>

            </form>
            `
            const pledgeForm = document.querySelector("#pledge-form");

            pledgeForm.addEventListener("submit", (event) => {
              event.preventDefault();

              let id = event.target.dataset.id;

              let investmentObj = {
                amount: event.target.pledge.value,
                business_id: id,
                user_id: currentUserId,
                description: event.target.description.value,
              };

              let confObj = {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(investmentObj),
              };

              fetch(`${investmentsUrl}`, confObj);
            });    

    } 


    const progressBar = document.querySelector('div#progress-bar')
    
    if (business.percentFunded < 100) {
    progressBar.style.width = `${business.percentFunded}%`
    } else {
        progressBar.style.width = "100%"
    }

    
    
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
    `<div data-id=${business.id}>
        <div>
            <img src=${business.picture} alt=${business.name}>
        <div>  
        <h4>${business.name}</h4>
        <p>${business.description}</p>
        <button class="learn_more">Learn More</button>
    </div>
    `

    let learnMoreBtn = document.querySelector('button.learn_more')
    
    // learnMoreBtn.addEventListener()
}

        
moreBizBtn.addEventListener('click', evt => {
    toggleOn(businessInfoDiv)
    toggleOff(showDiv)
    toggleOff(signUpForm)

    fetch(`${businessesURL}`)
    .then(response => response.json())
    .then(businesses => businesses.forEach(renderAllBusinesses))
    
    // toggleOff(moreBizBtn)
    
})

// showMore

signUpButton.addEventListener('click', event => {
    event.preventDefault()
    
    toggleOff(businessInfoDiv)
    toggleOff(signUpButton)
    
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
    event.preventDefault()
        
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
      .then((response) => response.json())
      .then((data) => {
          currentUserId = data.id
          alert(`hello ${data.name}! thanks for signing up!`)
          toggleOn(businessInfoDiv);
          toggleOff(pledgeFormDiv)
      })
    
    })
})

signInButton.addEventListener("click", function (event) {
  console.log("click")
   event.preventDefault();

   toggleOff(businessInfoDiv);
   toggleOff(signUpButton);

   showDiv.innerHTML = 
   `<form id="sign-in-form">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name"><br>

        <label for="email">Email:</label><br>
        <input type="text" id="email" name="email"><br>

        <button type="submit" value = "submit">Sign In</button>
    </form>`;

   let signInForm = document.querySelector("#sign-in-form");
   signInForm.addEventListener("submit", (event) => {
     event.preventDefault();

     let userObj = {
       name: event.target.name.value,
       email: event.target.email.value,
     };

     let confObj = {
       method: "POST",
       headers: {
         Accept: "application/json",
         "Content-Type": "application/json",
       },
       body: JSON.stringify(userObj),
     };
        fetch(`${baseUrl}/users`, confObj)
       .then((response) => response.json())
       .then((data) => {
         currentUserId = data.id;

         alert(`hello ${data.name}! thanks for signing in!`);
         toggleOn(businessInfoDiv);
         toggleOff(pledgeFormDiv);
       });
   });
});

// lendLi.addEventListener('click', )

fetchAllBusinesses(businessesURL);
fetchInvestmentData(investmentsUrl);






