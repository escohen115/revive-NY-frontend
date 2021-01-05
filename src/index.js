const baseUrl = "http://localhost:3000/api/v1"
const businessesURL = `${baseUrl}/businesses`
const investmentsUrl = `${baseUrl}/investments`
const businessInfoDiv = document.querySelector('div#business-info')
const statsDiv = document.querySelector('div#fundraising-stats')

let fetchAllBusinesses = (url) => {
    fetch(url)
    .then(r => r.json())
    .then(data => data.forEach(renderBusinessToInfoDiv))
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

    oneBizImg = document.createElement('img')
    oneBizImg.src = business.picture
    oneBizImg.alt = business.name

    oneBizP = document.createElement('p')
    oneBizP.textContent = business.description

    oneBizH4 = document.createElement('h4')
    oneBizH4.textContent = business.name

    oneBizBtn = document.createElement('button')
    oneBizBtn.innerText = 'Learn More'

    oneBizDiv.append(oneBizImg, oneBizH4, oneBizP, oneBizBtn)
    businessInfoDiv.append(oneBizDiv)
}

fetchAllBusinesses(businessesURL)
fetchInvestmentData(investmentsUrl)