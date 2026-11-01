const LOCAL_STORAGE_KEY = "canteenorders"
// canteen store menus
const menu = [
    { id: 1, name: "Biryani", price: 120, image: "🍛" },
    { id: 2, name: "Burger", price: 90, image: "🍔" },
    { id: 3, name: "Pizza", price: 150, image: "🍕" },
    { id: 4, name: "Fries", price: 60, image: "🍟" },
    { id: 5, name: "Sandwich", price: 70, image: "🥪" },
    { id: 6, name: "Coffee", price: 40, image: "☕" },
    { id: 7, name: "Cold Drink", price: 30, image: "🥤" },
    { id: 8, name: "Cake", price: 80, image: "🍰" },
];

const generate6DigitString = () => {
    return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

let cart = []
const mainLayout = document.getElementById("layout")
const tokenLayout = document.getElementById("token-layout")
const menuList = document.querySelector(".menu-list")
const orderList = document.querySelector(".order-list")
const totalBill = document.getElementById("total-bill")
const c_orderList = document.querySelector(".confirm-order-list")
const c_totalBill = document.getElementById("confirm-total-bill")
const confirmBtn = document.querySelector(".confirm-btn")
const randomToken = document.getElementById("random-token")
const customerName = document.getElementById("customer-name")
const phone = document.getElementById("phone")
const newOrderBtn = document.querySelector(".new-order")

const listSection = document.getElementById("list-section")
const tbody = document.getElementById("tbody")

const storeData = (data) => {
    let prevData = readStoreData()

    // Fallback to an empty array if prevData is null, undefined, or not an array
    let validPrevData = Array.isArray(prevData) ? prevData : [];
    let newArr = [...validPrevData, data]
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newArr))
}

const readStoreData = () => {
    let raw = localStorage.getItem(LOCAL_STORAGE_KEY) ? localStorage.getItem(LOCAL_STORAGE_KEY) : []
    // console.log(raw);
    if (raw.length == 0) {
        return raw
    } else {
        let data = JSON.parse(raw)
        // console.log(data);

        return data
    }
}

const renderMenu = () => {
    let html = ""

    menu.forEach((item) => {
        html += `   <div class="menu-card">
                        <h3>${item.image}</h3>
                        <h4>${item.name}</h4>
                        <h5>TK ${item.price}</h5>
                        <button  onclick="addItem(${item.id})">Add</button>
                    </div>
                  `
    })

    menuList.innerHTML = html
}

const addItem = (id) => {
    let exist = cart.find((c) => c.id == id)

    if (exist) {
        exist.quantity++
    } else {
        let food = menu.find((m) => m.id == id)
        if (food) {
            cart.push({ ...food, quantity: 1 })
        }
    }

    // console.log(cart);

    renderCartItens()
    calculateBill()

}

const renderCartItens = () => {
    if (cart.length > 0) {
        // orderList.innerHTML = ""

        let html = ""
        cart.forEach((c) => {
            html += ` <div class="order-card">

                        <h5>${c.name} x${c.quantity}</h5>
                        <span>TK ${c.quantity * c.price}</span>
                    </div>`
        })

        orderList.innerHTML = html
        c_orderList.innerHTML = html

    } else {
        orderList.innerHTML = `<p>No order</p>`
        c_orderList.innerHTML = `<p>No order</p>`
    }
}

const calculateBill = () => {
    let total = cart.reduce((init, item) => {
        return init + item.price * item.quantity
    }, 0)

    totalBill.innerHTML = `TK ${total}`
    c_totalBill.innerHTML = `TK ${total}`

    return total
}

const renderOrderList = () => {
    let prevData = readStoreData()

    // Fallback to an empty array if prevData is null, undefined, or not an array
    let validPrevData = Array.isArray(prevData) ? prevData : [];
    let html = ""
    validPrevData.map((data) => {
        html += `  <tr>
                        <td>${data.name}</td>
                        <td>${data.phone}</td>
                        <td>${data.total}</td>
                        <td>${data.time}</td>
                    </tr>`
    })

    tbody.innerHTML = html
}

confirmBtn.addEventListener("click", () => {
    if(cart.length == 0){
        alert("Empty Cart")
        return
    }
    let c_name = prompt("Enter Your Name")
    let phone_number = prompt("Enter Your Phone Number")


    if(!c_name || !phone_number){
        alert("Enter how are you!!!!!")
        return
    }

    let token = generate6DigitString()


    randomToken.innerHTML = token
    customerName.innerHTML = c_name
    phone.innerHTML = phone_number

    mainLayout.style.display = "none"
    listSection.style.display = "none"
    tokenLayout.style.display = "flex"

    let total = calculateBill()

    const d = new Date();
    let date = d.toLocaleString();

    let newOrder = {
        name: c_name,
        phone: phone_number,
        total,
        time: date
    }

    // let stringify = JSON.stringify(newOrder)

    storeData(newOrder)

    renderCartItens()
    calculateBill()
    renderOrderList()

})
newOrderBtn.addEventListener("click", () => {
    cart = []
    renderCartItens()
    calculateBill()

    mainLayout.style.display = "flex"
    listSection.style.display = "initial"
    tokenLayout.style.display = "none"
})




renderMenu()

renderCartItens()

calculateBill()

readStoreData()

renderOrderList()