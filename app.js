/* =========================================================
   VENDOR BUSINESS
   COMPLETE LOCAL REAL-TIME PROTOTYPE
   ========================================================= */


/* ================= DATA ================= */

const defaultData = {

    sales: 45800,

    profit: 18650,

    customers: [
        {
            id: 1,
            name: "Arun Kumar",
            type: "Regular Customer",
            phone: "9876543210"
        },
        {
            id: 2,
            name: "Ravi Stores",
            type: "Wholesale Customer",
            phone: "9876543211"
        },
        {
            id: 3,
            name: "Sri Kumar",
            type: "Regular Customer",
            phone: "9876543212"
        }
    ],

    stock: [
        {
            id: 1,
            name: "Product A",
            category: "General",
            quantity: 45,
            price: 250
        },
        {
            id: 2,
            name: "Product B",
            category: "General",
            quantity: 12,
            price: 400
        },
        {
            id: 3,
            name: "Product C",
            category: "General",
            quantity: 71,
            price: 180
        }
    ],

    orders: [
        {
            id: 1001,
            customer: "Arun Kumar",
            amount: 2500,
            profit: 800,
            status: "Completed"
        },
        {
            id: 1002,
            customer: "Ravi Stores",
            amount: 4800,
            profit: 1500,
            status: "Pending"
        },
        {
            id: 1003,
            customer: "Sri Kumar",
            amount: 1850,
            profit: 600,
            status: "Processing"
        }
    ],

    tasks: [
        {
            id: 1,
            text: "Check today's orders",
            completed: false
        },
        {
            id: 2,
            text: "Update stock",
            completed: false
        },
        {
            id: 3,
            text: "Contact customers",
            completed: true
        },
        {
            id: 4,
            text: "Check pending payments",
            completed: false
        }
    ],

    materials: [
        {
            id: 1,
            name: "Raw Materials",
            quantity: 78,
            unit: "%"
        },
        {
            id: 2,
            name: "Packaging",
            quantity: 55,
            unit: "%"
        },
        {
            id: 3,
            name: "Finished Materials",
            quantity: 82,
            unit: "%"
        }
    ],

    promotions: [
        {
            id: 1,
            title: "Festival Offer",
            description: "10% discount on selected products.",
            status: "Active"
        }
    ],

    certificates: [
        {
            id: 1,
            name: "Business Registration",
            expiry: "December 2027",
            status: "Valid"
        }
    ],

    debts: [
        {
            id: 1,
            customer: "Ravi Stores",
            amount: 5000,
            date: "2026-09-20",
            status: "Pending"
        },
        {
            id: 2,
            customer: "Arun Kumar",
            amount: 2500,
            date: "2026-09-22",
            status: "Pending"
        }
    ],

    notifications: [
        "📦 Product B is running low.",
        "💰 Payment pending from Ravi Stores.",
        "📋 You have pending business tasks."
    ],

    monthlySales: [
        4200,
        5800,
        4900,
        7200,
        6500,
        8500
    ],

    images: []

};


/* ================= STATE ================= */

let data = loadData();

let currentChart = "sales";


/* ================= STORAGE ================= */

function loadData() {

    const saved = localStorage.getItem("vendorBusinessData");

    if (saved) {

        try {
            return JSON.parse(saved);
        }

        catch (error) {
            console.error(error);
        }

    }

    return JSON.parse(JSON.stringify(defaultData));
}


function saveData() {

    localStorage.setItem(
        "vendorBusinessData",
        JSON.stringify(data)
    );

}


/* ================= HELPERS ================= */

function money(value) {

    return "₹" + Number(value).toLocaleString("en-IN");

}


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


function initials(name) {

    return name
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .substring(0, 2)
        .toUpperCase();

}


function today() {

    return new Date().toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* ================= PAGE NAVIGATION ================= */

function openPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {

        page.classList.remove("active");

    });


    const page = document.getElementById(pageName);

    if (page) {

        page.classList.add("active");

    }


    document.querySelectorAll(".nav-item").forEach(item => {

        item.classList.remove("active");

        if (item.dataset.page === pageName) {

            item.classList.add("active");

        }

    });


    if (window.innerWidth <= 800) {

        document.getElementById("sidebar")
            .classList.add("collapsed");

    }

}


/* ================= SIDEBAR ================= */

document.getElementById("menuButton")
    .addEventListener("click", () => {

        document
            .getElementById("sidebar")
            .classList.toggle("collapsed");

    });


document.querySelectorAll("[data-page]").forEach(button => {

    button.addEventListener("click", () => {

        openPage(button.dataset.page);

    });

});


/* ================= DASHBOARD ================= */

function renderDashboard() {

    document.getElementById("salesValue").textContent =
        money(data.sales);

    document.getElementById("profitValue").textContent =
        money(data.profit);

    document.getElementById("profitBig").textContent =
        money(data.profit);


    document.getElementById("stockValue").textContent =
        data.stock.length;


    const lowStock = data.stock.filter(
        item => Number(item.quantity) < 20
    ).length;


    document.getElementById("lowStockText").textContent =
        `${lowStock} low stock`;


    document.getElementById("customerValue").textContent =
        data.customers.length;


    const pendingTasks = data.tasks.filter(
        task => !task.completed
    ).length;


    document.getElementById("taskSummary").textContent =
        `${pendingTasks} pending`;


    document.getElementById("currentDate").textContent =
        today();


    const profitPercentage = Math.min(
        100,
        Math.max(
            0,
            data.sales
                ? (data.profit / data.sales) * 100
                : 0
        )
    );


    document.getElementById("profitBar").style.width =
        profitPercentage + "%";


    document.getElementById("profitMessage").textContent =
        profitPercentage > 30
            ? "Your current profit margin is healthy."
            : "Keep recording sales and expenses to monitor your margin.";


    renderDashboardTasks();

    renderMaterialsDashboard();

    renderChart();

}


/* ================= TASKS ================= */

function renderDashboardTasks() {

    const container =
        document.getElementById("dashboardTasks");

    container.innerHTML = "";


    data.tasks.slice(0, 5).forEach(task => {

        const row = document.createElement("label");

        row.className =
            "task-row" +
            (task.completed ? " completed" : "");


        row.innerHTML = `
            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                data-task-id="${task.id}"
            >

            <span>${escapeHTML(task.text)}</span>
        `;


        const checkbox =
            row.querySelector("input");


        checkbox.addEventListener("change", () => {

            task.completed = checkbox.checked;

            saveData();

            renderAll();

        });


        container.appendChild(row);

    });

}


function renderFullTasks() {

    const container =
        document.getElementById("fullTasks");

    container.innerHTML = "";


    data.tasks.forEach(task => {

        const row = document.createElement("label");

        row.className =
            "task-row" +
            (task.completed ? " completed" : "");


        row.innerHTML = `
            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span>${escapeHTML(task.text)}</span>

            <button
                class="table-action delete-task"
                type="button"
            >
                Delete
            </button>
        `;


        row.querySelector("input")
            .addEventListener("change", event => {

                task.completed =
                    event.target.checked;

                saveData();

                renderAll();

            });


        row.querySelector(".delete-task")
            .addEventListener("click", event => {

                event.preventDefault();

                data.tasks =
                    data.tasks.filter(
                        item => item.id !== task.id
                    );

                saveData();

                renderAll();

            });


        container.appendChild(row);

    });

}


/* ================= MATERIAL DASHBOARD ================= */

function renderMaterialsDashboard() {

    const container =
        document.getElementById("materialsDashboard");

    container.innerHTML = "";


    data.materials.forEach(material => {

        const item =
            document.createElement("div");

        item.className = "material-item";

        item.innerHTML = `
            <div class="material-info">

                <strong>
                    ${escapeHTML(material.name)}
                </strong>

                <small>
                    ${material.quantity}${material.unit}
                </small>

            </div>

            <div class="progress">

                <div
                    style="width:${Math.min(
                        100,
                        material.quantity
                    )}%"
                ></div>

            </div>
        `;

        container.appendChild(item);

    });

}


/* ================= CHART ================= */

function renderChart() {

    const container =
        document.getElementById("salesChart");

    if (!container) return;


    container.innerHTML = "";


    let values = [...data.monthlySales];


    if (currentChart === "profit") {

        values =
            values.map(
                value => Math.round(value * 0.4)
            );

    }


    if (currentChart === "orders") {

        values = [
            12,
            18,
            15,
            22,
            20,
            27
        ];

    }


    const months = [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep"
    ];


    const max =
        Math.max(...values, 1);


    values.forEach((value, index) => {

        const column =
            document.createElement("div");

        column.className = "chart-column";


        const bar =
            document.createElement("div");

        bar.className = "chart-bar";


        const height =
            Math.max(
                5,
                (value / max) * 90
            );


        bar.style.height = height + "%";


        const label =
            document.createElement("span");

        label.className = "chart-label";

        label.textContent =
            months[index];


        column.appendChild(bar);

        column.appendChild(label);

        container.appendChild(column);

    });


    renderLargeChart();

}


function renderLargeChart() {

    const container =
        document.getElementById("largeChart");

    if (!container) return;


    container.innerHTML = "";


    const max =
        Math.max(...data.monthlySales, 1);


    data.monthlySales.forEach(value => {

        const bar =
            document.createElement("div");

        bar.className =
            "large-chart-bar";


        bar.style.height =
            Math.max(
                5,
                (value / max) * 90
            ) + "%";


        container.appendChild(bar);

    });

}


/* ================= CUSTOMERS ================= */

function renderCustomers() {

    const container =
        document.getElementById("customerGrid");

    container.innerHTML = "";


    data.customers.forEach(customer => {

        const card =
            document.createElement("div");

        card.className = "customer-card";


        card.innerHTML = `
            <div class="avatar">
                ${initials(customer.name)}
            </div>

            <div>

                <strong>
                    ${escapeHTML(customer.name)}
                </strong>

                <p>
                    ${escapeHTML(customer.type)}
                </p>

                <p>
                    ${escapeHTML(customer.phone)}
                </p>

            </div>
        `;


        container.appendChild(card);

    });

}


/* ================= STOCK ================= */

function renderStock() {

    const tbody =
        document.getElementById("stockTable");

    tbody.innerHTML = "";


    data.stock.forEach(item => {

        let status = "Available";

        let statusClass = "available";


        if (item.quantity === 0) {

            status = "Out of Stock";

            statusClass = "out";

        }

        else if (item.quantity < 20) {

            status = "Low Stock";

            statusClass = "low";

        }


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${escapeHTML(item.name)}</td>

            <td>${escapeHTML(item.category)}</td>

            <td>${item.quantity}</td>

            <td>${money(item.price)}</td>

            <td>
                <span class="status ${statusClass}">
                    ${status}
                </span>
            </td>

            <td>

                <button
                    class="table-action update-stock"
                >
                    +10
                </button>

            </td>
        `;


        row.querySelector(".update-stock")
            .addEventListener("click", () => {

                item.quantity += 10;

                saveData();

                addNotification(
                    `📦 ${item.name} stock increased by 10.`
                );

                renderAll();

            });


        tbody.appendChild(row);

    });

}


/* ================= ORDERS ================= */

function renderOrders() {

    const tbody =
        document.getElementById("ordersTable");

    tbody.innerHTML = "";


    data.orders.forEach(order => {

        const row =
            document.createElement("tr");


        const statusClass =
            order.status.toLowerCase();


        row.innerHTML = `

            <td>#ORD${order.id}</td>

            <td>
                ${escapeHTML(order.customer)}
            </td>

            <td>
                ${money(order.amount)}
            </td>

            <td>
                ${money(order.profit)}
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${order.status}
                </span>
            </td>

            <td>

                <button
                    class="table-action complete-order"
                >
                    Complete
                </button>

            </td>
        `;


        row.querySelector(".complete-order")
            .addEventListener("click", () => {

                if (order.status !== "Completed") {

                    order.status = "Completed";

                    saveData();

                    addNotification(
                        `🛒 Order #ORD${order.id} completed.`
                    );

                    renderAll();

                }

            });


        tbody.appendChild(row);

    });

}


/* ================= PROMOTIONS ================= */

function renderPromotions() {

    const container =
        document.getElementById("promotionGrid");

    container.innerHTML = "";


    data.promotions.forEach(promotion => {

        const card =
            document.createElement("div");

        card.className = "promotion-card";


        card.innerHTML = `

            <h3>
                📢 ${escapeHTML(promotion.title)}
            </h3>

            <p>
                ${escapeHTML(promotion.description)}
            </p>

            <span class="status active">
                ${promotion.status}
            </span>

        `;


        container.appendChild(card);

    });

}


/* ================= MATERIALS ================= */

function renderMaterials() {

    const container =
        document.getElementById("materialGrid");

    container.innerHTML = "";


    data.materials.forEach(material => {

        const card =
            document.createElement("div");

        card.className = "material-card";


        card.innerHTML = `

            <h3>🧱 ${escapeHTML(material.name)}</h3>

            <p>
                Availability:
                <strong>
                    ${material.quantity}${material.unit}
                </strong>
            </p>

            <br>

            <div class="progress">

                <div
                    style="width:${Math.min(
                        100,
                        material.quantity
                    )}%"
                ></div>

            </div>
        `;


        container.appendChild(card);

    });

}


/* ================= CERTIFICATES ================= */

function renderCertificates() {

    const container =
        document.getElementById("certificateList");

    container.innerHTML = "";


    data.certificates.forEach(certificate => {

        const row =
            document.createElement("div");

        row.className = "certificate-row";


        row.innerHTML = `

            <div class="certificate-icon">
                📜
            </div>

            <div>

                <strong>
                    ${escapeHTML(certificate.name)}
                </strong>

                <p>
                    Valid until ${escapeHTML(
                        certificate.expiry
                    )}
                </p>

            </div>

            <span class="status active">
                ${certificate.status}
            </span>
        `;


        container.appendChild(row);

    });

}


/* ================= DEBT ================= */

function renderDebt() {

    const tbody =
        document.getElementById("debtTable");

    tbody.innerHTML = "";


    const total =
        data.debts
            .filter(debt => debt.status === "Pending")
            .reduce(
                (sum, debt) =>
                    sum + Number(debt.amount),
                0
            );


    const pendingCustomers =
        data.debts.filter(
            debt => debt.status === "Pending"
        ).length;


    document.getElementById("totalDebt")
        .textContent = money(total);


    document.getElementById("debtCustomers")
        .textContent = pendingCustomers;


    data.debts.forEach(debt => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(debt.customer)}
            </td>

            <td>
                ${money(debt.amount)}
            </td>

            <td>
                ${escapeHTML(debt.date)}
            </td>

            <td>

                <span class="status ${
                    debt.status === "Paid"
                        ? "paid"
                        : "pending"
                }">

                    ${debt.status}

                </span>

            </td>

            <td>

                ${
                    debt.status === "Pending"
                        ? `
                            <button
                                class="table-action pay-debt"
                            >
                                Mark Paid
                            </button>
                          `
                        : "-"
                }

            </td>
        `;


        const payButton =
            row.querySelector(".pay-debt");


        if (payButton) {

            payButton.addEventListener(
                "click",
                () => {

                    debt.status = "Paid";

                    saveData();

                    addNotification(
                        `💰 Payment received from ${debt.customer}.`
                    );

                    renderAll();

                }
            );

        }


        tbody.appendChild(row);

    });

}


/* ================= NOTIFICATIONS ================= */

function addNotification(message) {

    data.notifications.unshift(message);

    data.notifications =
        data.notifications.slice(0, 10);

    saveData();

    renderNotifications();

}


function renderNotifications() {

    const container =
        document.getElementById("notificationList");

    container.innerHTML = "";


    data.notifications.forEach(message => {

        const item =
            document.createElement("div");

        item.className =
            "notification-item";

        item.textContent = message;

        container.appendChild(item);

    });


    document.getElementById("notificationBadge")
        .textContent = data.notifications.length;

}


/* ================= MODAL ================= */

const modal =
    document.getElementById("modalOverlay");

const modalTitle =
    document.getElementById("modalTitle");

const modalBody =
    document.getElementById("modalBody");


function openModal(title, html, submitFunction) {

    modalTitle.textContent = title;

    modalBody.innerHTML = html;

    modal.classList.add("show");


    const form =
        modalBody.querySelector("form");


    if (form) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                submitFunction(
                    new FormData(form)
                );

                closeModal();

            }
        );

    }

}


function closeModal() {

    modal.classList.remove("show");

}


document.getElementById("modalClose")
    .addEventListener("click", closeModal);


modal.addEventListener("click", event => {

    if (event.target === modal) {

        closeModal();

    }

});


/* ================= ADD TASK ================= */

function addTask() {

    openModal(

        "Add Task",

        `
            <form>

                <div class="form-group">

                    <label>Task</label>

                    <input
                        name="task"
                        required
                        placeholder="Enter business task"
                    >

                </div>

                <button class="form-submit">
                    Add Task
                </button>

            </form>
        `,

        formData => {

            const text =
                formData.get("task").trim();


            data.tasks.push({

                id: Date.now(),

                text,

                completed: false

            });


            saveData();

            addNotification(
                `📋 New task added: ${text}`
            );

            renderAll();

        }

    );

}


document.getElementById("addTaskButton")
    .addEventListener("click", addTask);


document.getElementById("addTaskFull")
    .addEventListener("click", addTask);


/* ================= ADD CUSTOMER ================= */

function addCustomer() {

    openModal(

        "Add Customer",

        `
            <form>

                <div class="form-group">

                    <label>Name</label>

                    <input
                        name="name"
                        required
                        placeholder="Customer name"
                    >

                </div>

                <div class="form-group">

                    <label>Type</label>

                    <select name="type">

                        <option>
                            Regular Customer
                        </option>

                        <option>
                            Wholesale Customer
                        </option>

                        <option>
                            New Customer
                        </option>

                    </select>

                </div>

                <div class="form-group">

                    <label>Phone</label>

                    <input
                        name="phone"
                        placeholder="Phone number"
                    >

                </div>

                <button class="form-submit">
                    Add Customer
                </button>

            </form>
        `,

        formData => {

            const name =
                formData.get("name").trim();


            data.customers.push({

                id: Date.now(),

                name,

                type: formData.get("type"),

                phone:
                    formData.get("phone") ||
                    "Not provided"

            });


            saveData();

            addNotification(
                `👥 New customer added: ${name}`
            );

            renderAll();

        }

    );

}


document.getElementById("addCustomerButton")
    .addEventListener("click", addCustomer);


/* ================= ADD STOCK ================= */

function addStock() {

    openModal(

        "Add Stock",

        `
            <form>

                <div class="form-group">

                    <label>Product</label>

                    <input
                        name="name"
                        required
                        placeholder="Product name"
                    >

                </div>

                <div class="form-group">

                    <label>Category</label>

                    <input
                        name="category"
                        value="General"
                    >

                </div>

                <div class="form-group">

                    <label>Quantity</label>

                    <input
                        name="quantity"
                        type="number"
                        min="0"
                        required
                    >

                </div>

                <div class="form-group">

                    <label>Price</label>

                    <input
                        name="price"
                        type="number"
                        min="0"
                        required
                    >

                </div>

                <button class="form-submit">
                    Add Stock
                </button>

            </form>
        `,

        formData => {

            const item = {

                id: Date.now(),

                name:
                    formData.get("name").trim(),

                category:
                    formData.get("category") ||
                    "General",

                quantity:
                    Number(formData.get("quantity")),

                price:
                    Number(formData.get("price"))

            };


            data.stock.push(item);

            saveData();

            addNotification(
                `📦 Stock added: ${item.name}`
            );

            renderAll();

        }

    );

}


document.getElementById("addStockButton")
    .addEventListener("click", addStock);


/* ================= ADD ORDER ================= */

function addOrder() {

    openModal(

        "New Order",

        `
            <form>

                <div class="form-group">

                    <label>Customer</label>

                    <select name="customer">

                        ${data.customers.map(customer => `
                            <option>
                                ${escapeHTML(customer.name)}
                            </option>
                        `).join("")}

                    </select>

                </div>

                <div class="form-group">

                    <label>Amount</label>

                    <input
                        name="amount"
                        type="number"
                        min="0"
                        required
                    >

                </div>

                <div class="form-group">

                    <label>Estimated Profit</label>

                    <input
                        name="profit"
                        type="number"
                        min="0"
                        required
                    >

                </div>

                <button class="form-submit">
                    Create Order
                </button>

            </form>
        `,

        formData => {

            const amount =
                Number(formData.get("amount"));


            const profit =
                Number(formData.get("profit"));


            const order = {

                id:
                    Date.now()
                    .toString()
                    .slice(-6),

                customer:
                    formData.get("customer"),

                amount,

                profit,

                status: "Pending"

            };


            data.orders.unshift(order);

            data.sales += amount;

            data.profit += profit;


            data.monthlySales[
                data.monthlySales.length - 1
            ] += amount;


            saveData();


            addNotification(
                `🛒 New order created for ${order.customer}.`
            );


            renderAll();

        }

    );

}


document.getElementById("addOrderButton")
    .addEventListener("click", addOrder);


/* ================= QUICK SALE ================= */

document.getElementById("quickSaleButton")
    .addEventListener("click", () => {

        openModal(

            "Quick Sale",

            `
                <form>

                    <div class="form-group">

                        <label>Sale Amount</label>

                        <input
                            name="amount"
                            type="number"
                            min="1"
                            required
                            placeholder="Example: 2500"
                        >

                    </div>

                    <div class="form-group">

                        <label>Profit</label>

                        <input
                            name="profit"
                            type="number"
                            min="0"
                            required
                            placeholder="Example: 800"
                        >

                    </div>

                    <button class="form-submit">
                        Record Sale
                    </button>

                </form>
            `,

            formData => {

                const amount =
                    Number(formData.get("amount"));


                const profit =
                    Number(formData.get("profit"));


                data.sales += amount;

                data.profit += profit;


                data.monthlySales[
                    data.monthlySales.length - 1
                ] += amount;


                saveData();


                addNotification(
                    `💰 Sale recorded: ${money(amount)}`
                );


                renderAll();

            }

        );

    });


/* ================= PROMOTION ================= */

document.getElementById("addPromotionButton")
    .addEventListener("click", () => {

        openModal(

            "Create Promotion",

            `
                <form>

                    <div class="form-group">

                        <label>Promotion Name</label>

                        <input
                            name="title"
                            required
                            placeholder="Festival Offer"
                        >

                    </div>

                    <div class="form-group">

                        <label>Description</label>

                        <input
                            name="description"
                            required
                            placeholder="10% discount"
                        >

                    </div>

                    <button class="form-submit">
                        Create Promotion
                    </button>

                </form>
            `,

            formData => {

                data.promotions.push({

                    id: Date.now(),

                    title:
                        formData.get("title"),

                    description:
                        formData.get("description"),

                    status: "Active"

                });


                saveData();

                renderAll();

            }

        );

    });


/* ================= MATERIAL ================= */

document.getElementById("addMaterialButton")
    .addEventListener("click", () => {

        openModal(

            "Add Material",

            `
                <form>

                    <div class="form-group">

                        <label>Material Name</label>

                        <input
                            name="name"
                            required
                        >

                    </div>

                    <div class="form-group">

                        <label>Availability %</label>

                        <input
                            name="quantity"
                            type="number"
                            min="0"
                            max="100"
                            required
                        >

                    </div>

                    <button class="form-submit">
                        Add Material
                    </button>

                </form>
            `,

            formData => {

                data.materials.push({

                    id: Date.now(),

                    name:
                        formData.get("name"),

                    quantity:
                        Number(formData.get("quantity")),

                    unit: "%"

                });


                saveData();

                renderAll();

            }

        );

    });


/* ================= CERTIFICATE ================= */

document.getElementById("addCertificateButton")
    .addEventListener("click", () => {

        openModal(

            "Add Certificate",

            `
                <form>

                    <div class="form-group">

                        <label>Certificate Name</label>

                        <input
                            name="name"
                            required
                        >

                    </div>

                    <div class="form-group">

                        <label>Expiry</label>

                        <input
                            name="expiry"
                            required
                            placeholder="December 2027"
                        >

                    </div>

                    <button class="form-submit">
                        Add Certificate
                    </button>

                </form>
            `,

            formData => {

                data.certificates.push({

                    id: Date.now(),

                    name:
                        formData.get("name"),

                    expiry:
                        formData.get("expiry"),

                    status: "Valid"

                });


                saveData();

                renderAll();

            }

        );

    });


/* ================= DEBT ================= */

document.getElementById("addDebtButton")
    .addEventListener("click", () => {

        openModal(

            "Add Debt",

            `
                <form>

                    <div class="form-group">

                        <label>Customer</label>

                        <input
                            name="customer"
                            required
                        >

                    </div>

                    <div class="form-group">

                        <label>Amount</label>

                        <input
                            name="amount"
                            type="number"
                            min="0"
                            required
                        >

                    </div>

                    <button class="form-submit">
                        Add Debt
                    </button>

                </form>
            `,

            formData => {

                data.debts.push({

                    id: Date.now(),

                    customer:
                        formData.get("customer"),

                    amount:
                        Number(formData.get("amount")),

                    date:
                        new Date()
                            .toISOString()
                            .split("T")[0],

                    status: "Pending"

                });


                saveData();


                addNotification(
                    "💰 New customer debt recorded."
                );


                renderAll();

            }

        );

    });


/* ================= CHART SELECT ================= */

document.getElementById("chartType")
    .addEventListener("change", event => {

        currentChart =
            event.target.value;

        renderChart();

    });


/* ================= CHAT ================= */

document.getElementById("sendMessage")
    .addEventListener("click", sendChatMessage);


document.getElementById("chatInput")
    .addEventListener("keydown", event => {

        if (event.key === "Enter") {

            sendChatMessage();

        }

    });


function sendChatMessage() {

    const input =
        document.getElementById("chatInput");

    const text =
        input.value.trim();


    if (!text) return;


    const messages =
        document.getElementById("messages");


    const userMessage =
        document.createElement("div");

    userMessage.className =
        "message sent";

    userMessage.textContent =
        text;


    messages.appendChild(userMessage);


    input.value = "";


    setTimeout(() => {

        const reply =
            document.createElement("div");

        reply.className =
            "message received";

        reply.textContent =
            "Thanks. Your message has been recorded in this prototype.";


        messages.appendChild(reply);

        messages.scrollTop =
            messages.scrollHeight;

    }, 400);

}


/* ================= IMAGES ================= */

document.getElementById("imageUpload")
    .addEventListener("change", event => {

        const file =
            event.target.files[0];


        if (!file) return;


        const reader =
            new FileReader();


        reader.onload = function(e) {

            data.images.push({

                id: Date.now(),

                name: file.name,

                src: e.target.result

            });


            saveData();

            renderImages();

        };


        reader.readAsDataURL(file);

    });


function renderImages() {

    const container =
        document.getElementById("imageGallery");

    container.innerHTML = "";


    if (data.images.length === 0) {

        container.innerHTML = `
            <div class="card">
                <h3>No images yet</h3>
                <p style="color:var(--muted);margin-top:8px">
                    Upload a business image to see it here.
                </p>
            </div>
        `;

        return;

    }


    data.images.forEach(image => {

        const card =
            document.createElement("div");

        card.className =
            "image-card";


        card.innerHTML = `

            <img src="${image.src}">

            <p>
                ${escapeHTML(image.name)}
            </p>

        `;


        container.appendChild(card);

    });

}


/* ================= SEARCH ================= */

document.getElementById("searchButton")
    .addEventListener("click", () => {

        openModal(

            "Business Search",

            `
                <div class="form-group">

                    <label>
                        Search your business data
                    </label>

                    <input
                        id="globalSearch"
                        placeholder="customer, product, order..."
                    >

                </div>

                <div id="searchResults"></div>
            `,

            () => {}

        );


        const input =
            document.getElementById("globalSearch");


        input.addEventListener("input", () => {

            const query =
                input.value.toLowerCase();


            const results = [];


            data.customers.forEach(customer => {

                if (
                    customer.name
                        .toLowerCase()
                        .includes(query)
                ) {

                    results.push(
                        `👥 Customer: ${customer.name}`
                    );

                }

            });


            data.stock.forEach(item => {

                if (
                    item.name
                        .toLowerCase()
                        .includes(query)
                ) {

                    results.push(
                        `📦 Stock: ${item.name}`
                    );

                }

            });


            data.orders.forEach(order => {

                if (
                    order.customer
                        .toLowerCase()
                        .includes(query)
                ) {

                    results.push(
                        `🛒 Order: ${order.customer}`
                    );

                }

            });


            document.getElementById("searchResults")
                .innerHTML =
                results.length
                    ? results.map(
                        result =>
                            `<p style="padding:8px 0">
                                ${escapeHTML(result)}
                             </p>`
                    ).join("")
                    : "<p>No results found.</p>";

        });

    });


/* ================= THEME ================= */

document.getElementById("themeButton")
    .addEventListener("click", () => {

        document.body.classList.toggle("dark");

        localStorage.setItem(
            "vendorDarkMode",
            document.body.classList.contains("dark")
        );

    });


if (
    localStorage.getItem("vendorDarkMode")
    === "true"
) {

    document.body.classList.add("dark");

}


/* ================= NOTIFICATION PANEL ================= */

document.getElementById("notificationButton")
    .addEventListener("click", () => {

        document
            .getElementById("notificationPanel")
            .classList.toggle("show");

    });


document.getElementById("closeNotifications")
    .addEventListener("click", () => {

        document
            .getElementById("notificationPanel")
            .classList.remove("show");

    });


/* ================= PROFILE ================= */

document.getElementById("profileButton")
    .addEventListener("click", () => {

        document
            .getElementById("profilePanel")
            .classList.toggle("show");

    });


document.getElementById("closeProfile")
    .addEventListener("click", () => {

        document
            .getElementById("profilePanel")
            .classList.remove("show");

    });


/* ================= AI ASSISTANT ================= */

const assistantInput =
    document.getElementById("assistantInput");

const assistantMessages =
    document.getElementById("assistantMessages");


function addAssistantMessage(text, type) {

    const message =
        document.createElement("div");

    message.className =
        "assistant-message " + type;

    message.textContent =
        text;


    assistantMessages.appendChild(message);


    assistantMessages.scrollTop =
        assistantMessages.scrollHeight;

}


function businessAssistant(question) {

    const q =
        question.toLowerCase();


    if (
        q.includes("sales") ||
        q.includes("revenue")
    ) {

        return `
Your current recorded sales are ${money(data.sales)}.
You have ${data.orders.length} recorded orders.
        `.trim();

    }


    if (
        q.includes("profit") ||
        q.includes("earning")
    ) {

        const margin =
            data.sales
                ? ((data.profit / data.sales) * 100)
                    .toFixed(1)
                : 0;


        return `
Your recorded profit is ${money(data.profit)}.
Your current calculated profit margin is ${margin}%.
        `.trim();

    }


    if (
        q.includes("stock") ||
        q.includes("inventory")
    ) {

        const low =
            data.stock.filter(
                item => item.quantity < 20
            );


        if (low.length === 0) {

            return "Your current stock list has no items below the low-stock threshold.";

        }


        return `
You have ${low.length} low-stock item(s): ${low.map(item => item.name).join(", ")}.
        `.trim();

    }


    if (
        q.includes("customer") ||
        q.includes("client")
    ) {

        return `
You currently have ${data.customers.length} registered customers.
        `.trim();

    }


    if (
        q.includes("task") ||
        q.includes("todo")
    ) {

        const pending =
            data.tasks.filter(
                task => !task.completed
            );


        if (!pending.length) {

            return "You have no pending tasks.";

        }


        return `
You have ${pending.length} pending task(s): ${pending.map(task => task.text).join(", ")}.
        `.trim();

    }


    if (
        q.includes("debt") ||
        q.includes("payment")
    ) {

        const total =
            data.debts
                .filter(
                    debt => debt.status === "Pending"
                )
                .reduce(
                    (sum, debt) =>
                        sum + Number(debt.amount),
                    0
                );


        return `
Your outstanding recorded debt is ${money(total)} across ${data.debts.filter(d => d.status === "Pending").length} pending payment(s).
        `.trim();

    }


    if (
        q.includes("order")
    ) {

        const pending =
            data.orders.filter(
                order =>
                    order.status !== "Completed"
            ).length;


        return `
You have ${data.orders.length} total recorded orders and ${pending} order(s) that are not completed.
        `.trim();

    }


    if (
        q.includes("hello") ||
        q.includes("hi")
    ) {

        return "Hello! I'm ready to help you understand your business data.";

    }


    if (
        q.includes("help") ||
        q.includes("what can you do")
    ) {

        return `
I can answer questions about your sales, profit, stock, customers, orders, tasks and outstanding debt.
        `.trim();

    }


    return `
I can help with sales, profit, stock, customers, orders, tasks and debt. Try asking: "How are my sales?"
    `.trim();

}


function sendAssistantMessage() {

    const question =
        assistantInput.value.trim();


    if (!question) return;


    addAssistantMessage(
        question,
        "user"
    );


    assistantInput.value = "";


    setTimeout(() => {

        const response =
            businessAssistant(question);


        addAssistantMessage(
            response,
            "ai"
        );

    }, 300);

}


document.getElementById("assistantSend")
    .addEventListener(
        "click",
        sendAssistantMessage
    );


assistantInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            sendAssistantMessage();

        }

    }
);


/* ================= ASSISTANT SUGGESTIONS ================= */

document
    .querySelectorAll(".assistant-suggestions button")
    .forEach(button => {

        button.addEventListener("click", () => {

            assistantInput.value =
                button.textContent;

            sendAssistantMessage();

        });

    });


/* ================= VOICE ================= */

document.getElementById("voiceButton")
    .addEventListener("click", () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            alert(
                "Voice recognition is not supported by this browser."
            );

            return;

        }


        const recognition =
            new SpeechRecognition();


        recognition.lang = "en-IN";

        recognition.interimResults = false;

        recognition.maxAlternatives = 1;


        recognition.start();


        recognition.onresult = event => {

            const text =
                event.results[0][0].transcript;


            assistantInput.value = text;

            sendAssistantMessage();

        };

    });


/* ================= RENDER EVERYTHING ================= */

function renderAll() {

    saveData();

    renderDashboard();

    renderFullTasks();

    renderCustomers();

    renderStock();

    renderOrders();

    renderPromotions();

    renderMaterials();

    renderCertificates();

    renderDebt();

    renderNotifications();

    renderImages();

}


/* ================= START APPLICATION ================= */

renderAll();