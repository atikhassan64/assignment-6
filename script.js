const categoryContainer = document.getElementsByClassName('categoryContainer')
const plantContainer = document.getElementById('plantContainer')
const cartContainer = document.getElementById('cartContainer')

const loadCategory = () => {
    fetch(`https://openapi.programming-hero.com/api/categories`)
        .then(response => response.json())
        .then(data => {
            const categories = data.categories;
            showCategories(categories)
        })
        .catch(error => {
            console.log(error)
        })
}

const loadPlants = () => {
    const spinner = document.getElementById('spinner')
    spinner.style.display = 'block'
    fetch(`https://openapi.programming-hero.com/api/plants`)
        .then(response => response.json())
        .then(data => {
            spinner.style.display = 'none'
            const plants = data.plants;
            showPlantsByCategories(plants)
        })
        .catch(error => {
            console.log(error)
        })
}
loadPlants()

const showCategories = (categories) => {
    categories.forEach(cat => {
        for (let i = 0; i < categoryContainer.length; i++) {
            const categories = categoryContainer[i];
            categories.innerHTML += `
                        <li id="${cat.id}" class="mt-[15px] hover:bg-[#15803D] cursor-pointer rounded-md hover:text-white px-[15px] py-[10px]">
                        ${cat.category_name}</li>              
                    `
        }
    });
    for (let i = 0; i < categoryContainer.length; i++) {
        const categories = categoryContainer[i];
        categories.addEventListener('click', (e) => {
            const allLi = document.querySelectorAll('li')
            allLi.forEach(li => {
                li.classList.remove('bg-[#15803D]')
                li.classList.remove('text-white')
            })
            const localName = e.target.localName;
            if (localName === 'li') {
                e.target.classList.add('bg-[#15803D]')
                e.target.classList.add('text-white')
                loadPlantsByCategories(e.target.id)
            }
        })
    }
}

const loadPlantsByCategories = (categoryId) => {
    fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
        .then(response => response.json())
        .then(data => {
            showPlantsByCategories(data.plants)
        })
        .catch(error => {
            console.log(error)
        })
}

const loadPlantDetails = (id) =>{
    fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then(response => response.json())
    .then(details => {
        displayPlantDetails(details.plants)
    })
}

const displayPlantDetails = (plant) => {
    const detailsBox = document.getElementById('detailsContainer')
    detailsBox.innerHTML = `
        <div class="image bg-slate-400 w-full h-[250px] flex items-center justify-center mx-auto mb-[10px]">
            <img class="object-cover h-full w-full" src="${plant.image}" alt="">
          </div>
          <h1 class="text-[18px] font-medium mb-[5px]">${plant.name}</h1>
          <p class="text-[12px] mb-[10px]">${plant.description}</p>
          <p class="categories-name text-[14px] bg-[#DCFCE7] text-[#15803D] px-[10px] py-[5px] rounded-full inline-block">${plant.category}</p>
          <div class="categories-name-price flex items-center justify-between mb-[10px]">
            <h1 class="price font-bold"><span>৳ </span>${plant.price}</h1>
            <div class="modal-action">
              <form method="dialog">
                <button class="btn">Close</button>
              </form>
            </div>
          </div>
    `
    document.getElementById('my_modal_5').showModal()
}

const showPlantsByCategories = (plants) => {
    plantContainer.innerHTML = ""
    plants.forEach(plant => {
        plantContainer.innerHTML += `
            <div id="${plant.id}" class="card bg-white p-[15px] rounded-md w-full  mb-[15px] sm:mb-0">
                <div class="image bg-slate-400 w-full h-[150px] flex items-center justify-center mx-auto mb-[10px]">
                    <img class="object-cover h-full w-full" src="${plant.image}" alt="">
                </div>
                <h1 onclick="loadPlantDetails(${plant.id})" class="text-[18px] font-medium mb-[5px]">${plant.name}</h1>
                <p class="text-[12px] mb-[10px] line-clamp-3">${plant.description}</p>
                <div class="categories-name-price flex items-center justify-between mb-[10px]">
                    <p class="categories-name text-[14px] bg-[#DCFCE7] text-[#15803D] px-[10px] py-[5px] rounded-full">${plant.category}</p>
                <h1 class="price font-bold"><span>৳ </span>${plant.price}</h1>
                </div>
                <button id="cart-btn" class=" w-full bg-[#15803D] py-[10px] rounded-full text-white font-semibold cursor-pointer hover:bg-[#15803cc5] duration-300">Add to Cart</button>
            </div>
        `
    })
    const allTrees = document.getElementsByClassName('allTrees')
    for (let i = 0; i < allTrees.length; i++) {
        const allTree = allTrees[i];
        allTree.addEventListener('click', () => {
            loadPlants()
        })
    }
}
loadCategory()


let totalPrice = document.getElementById('totalPrice')
let totalPriceDefaultValue = 0
totalPrice.innerText = totalPriceDefaultValue


let carts = []
plantContainer.addEventListener('click', (e) => {
    if (e.target.innerText === "Add to Cart") {
        addCarts(e)
    }
})

const addCarts = (e) => {
    alert(`Adds the ${e.target.parentNode.children[1].innerText} to Cart List`)
    const title = e.target.parentNode.children[1].innerText
    const id = e.target.parentNode.id
    const moneyIcon = e.target.parentNode.children[3].children[1].childNodes[0].innerText
    const price = parseInt(e.target.parentNode.children[3].children[1].childNodes[1].data)
    totalPriceDefaultValue += price
    totalPrice.innerText = totalPriceDefaultValue
    carts.push({
        title: title,
        id: id,
        moneyIcon: moneyIcon,
        price: price
    })
    showCarts(carts)
}

const showCarts = (carts) => {
    cartContainer.innerHTML = ''
    carts.forEach(cart => {
        cartContainer.innerHTML += `
        <div id="${cart.id}" class="bg-[#F0FDF4] p-[10px] flex items-center justify-between mb-[10px]">
            <div>
                <h1 class="font-semibold">${cart.title}</h1>
                <p>${cart.moneyIcon} ${cart.price}</p>
            </div>
            <p onclick="deleteCart('${cart.id}')" class="cursor-pointer hover:text-red-600"><i class="fa-solid fa-xmark"></i></p>
        </div>
        `
    })
}
const deleteCart = (cartId) => {
    const deletes = carts.find(cart => cart.id === cartId)
    if (deletes) {
        totalPriceDefaultValue -= deletes.price
        totalPrice.innerText = totalPriceDefaultValue
    }
    carts = carts.filter(cart => cart.id !== cartId)
    showCarts(carts)
}