const baseUrl = "http://localhost:3000/api/v1"
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
const signOutButton = document.querySelector("li#sign-out");
const signUpForm = document.querySelector("#sign-up-form")
const projectDescription = document.querySelector("#project-description");

let currentUser = {}

let numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let showPageFromListener = (event) => {
    
    // debugger 
    if (event.target.matches('button.learn_more')) 
    {
        toggleOff(businessInfoDiv);
      let id = event.target.closest("div").dataset.id;

      fetch(`${businessesURL}/${id}`)
        .then((response) => response.json())
        .then((business) => renderBusinessPage(business));
    }

}

let fetchUserInvestments = () => {

    fetch(`${userUrl}/investments`)
        .then(r => r.json())
        .then(investments => console.log(investments))
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
    toggleOff(investmentsLi)
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

businessInfoDiv.addEventListener('click', showPageFromListener)




let renderBusinessPage = (business) => 
{
    
    toggleOn(showDiv)
    toggleOff(allBizDiv)

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
        <h2>$${numberWithCommas(business.goal)} Goal</h2>
        <h3>${Math.round(business.percentFunded)} Percent funded<h3>
        <div id='progress-bar'> </div>
        <h4>$${numberWithCommas(business.moneyMade)} raised</h4>
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
    </div>`

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


                <button type="submit" value = "Submit">Pledge</button>

            </form>
            `
            const pledgeForm = document.querySelector("#pledge-form");

            pledgeForm.addEventListener("submit", (event) => {
              event.preventDefault();

              let id = event.target.dataset.id;
            if (event.target.pledge.value == 0) {
                alert('Amount must be more than zero!')
            }
            else  {
                alert('Thank you for your donation!')
                let investmentObj = {
                    amount: event.target.pledge.value,
                    business_id: id,
                    user_id: currentUser.id,
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
            }
            event.target.reset()
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
        <div data-id=${business.id}>
            <img src=${business.picture} alt=${business.name}>
        </div>  
        <h4>${business.name}</h4>
        <p>${business.description}</p>
        <button class="learn_more">Learn More</button>
    </div>
    `

    let learnMoreBtn = document.querySelector('button.learn_more')
    // debugger 

    // learnMoreBtn.addEventListener('click', () => console.log('clicked'))
}

allBizDiv.addEventListener('click', showPageFromListener)

        
moreBizBtn.addEventListener('click', evt => {
    toggleOn(businessInfoDiv)
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
  toggleOff(businessInfoDiv);
  toggleOff(signUpButton);
  toggleOn(signInButton);

  showDiv.innerHTML = 
  `<form data-id="${2}" id="sign-up-form">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name"><br>

        <label for="email">Email:</label><br>
        <input type="text" id="email" name="email"><br>

        <button type="submit" value = "submit">Create an Account</button>
    </form>`;

  let signUpForm = document.querySelector("#sign-up-form");
  signUpForm.addEventListener("submit", (event) => {
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
        currentUser = data;
        if (currentUser.status != 422) {
            alert(`hello ${currentUser.name}! thanks for signing up!`);
            toggleOff(signInButton);
            toggleOn(businessInfoDiv);
            toggleOn(investmentsLi);
            toggleOff(showDiv);
            toggleOn(businessInfoDiv);
            toggleOff(pledgeFormDiv);
            toggleOff(showDiv); 
        }
        else 
        {
          alert("email taken");
        }
      });
  });
});

signInButton.addEventListener("click", function (event) {
    toggleOn(signUpButton)
    toggleOff(signInButton);
    toggleOff(businessInfoDiv);
    

    showDiv.innerHTML = 
    `<form id="sign-in-form">

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

    fetch(`${baseUrl}/users/sign_in`, confObj)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        currentUser = data;
        alert(`hello ${currentUser.name}! thanks for signing in!`);
        toggleOff(signInButton);
        toggleOff(signUpButton);
        toggleOn(businessInfoDiv);
        toggleOn(signOutButton);
        toggleOn(investmentsLi)
        toggleOff(signInForm)
        toggleOff(showDiv)
      });
});
});

lendLi.addEventListener('click', evt => {

    toggleOn(signInButton)
    toggleOn(signUpButton)
        
    if (allBizDiv.children.length > 0) {
        toggleOn(allBizDiv)
        toggleOff(businessInfoDiv)
    }
    else 
    {
        toggleOff(showDiv)
        fetchAllBusinesses()
        toggleOn(allBizDiv)
    }

})

let renderOneInvestment = (investment) => {


    newDiv = document.createElement('div')
    newDiv.innerHTML = 
    
    `<form id=${investment.id}>

        <label for="amount">Amount:</label>
        <input type="number" name="amount" value=${investment.amount}><br>
        
        <label for="description>Description:</label>
        <input type="text" name="description" value=${investment.description}>
        
        <button type="submit" value="submit">Update</button>

    </form>`

    investmentsDiv.append(newDiv)
    
}

investmentsLi.addEventListener("click", (event) => {
    showDiv.innerHTML = ''
    toggleOff(projectDescription);
    toggleOff(businessInfoDiv);
    toggleOff(investmentsLi)
    toggleOn(showDiv);
    
    h2 = document.createElement("h2");
    h2.textContent = "My Investments:";

    investmentsDiv = document.createElement('div')

    showDiv.append(h2, investmentsDiv);


//   fetchUserInvestments();
    currentUser.investments.forEach(renderOneInvestment)

})

signOutButton.addEventListener('click', event => {
    currentUser = {}

    alert("Signing out...")
    
    toggleOff(signOutButton)
    toggleOn(signInButton)
    toggleOn(signUpButton)
    toggleOff(investmentsLi)
})


let deleteBtn = document.createElement('button')
    deleteBtn.id = 'delete-user'
    deleteBtn.textContent = 'Delete your account'


// deleteBtn.addEventListener('click', evt )

toggleOff(signOutButton)
toggleOff(investmentsLi)

fetch5Businesses(businessesURL);
// fetchTotalInvestmentData(investmentsUrl);






