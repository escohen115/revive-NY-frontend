const businessesURL = "http://localhost:3000/api/v1/businesses"

let fetchAllBusinesses = (url) => {
    fetch(url)
    .then(r => r.json())
    .then(data => console.log(data))
}

fetchAllBusinesses(businessesURL)
