    const API_URL = "https://api.escuelajs.co/api/v1/products";

    let allProducts = [];
    let filteredProducts = [];

    let currentPage = 1;
    let pageSize = 10;

    let titleAsc = true;
    let priceAsc = true;


    // ========= LOAD =========
    async function loadProducts() {
        const res = await fetch(API_URL);
        allProducts = await res.json();
        filteredProducts = [...allProducts];
        render();
    }


    // ========= MAIN =========
    function render() {
        renderTable();
        renderPagination();
    }


    // ========= TABLE =========
    function renderTable() {
        const table = document.getElementById("productTable");
        table.innerHTML = "";

        if (filteredProducts.length === 0) {
            table.innerHTML =
                `<tr><td colspan="5" class="text-center">No results</td></tr>`;
            return;
        }

        const start = (currentPage - 1) * pageSize;
        const pageData = filteredProducts.slice(start, start + pageSize);

        pageData.forEach(p => {

            const img = p.images?.[0] || "https://via.placeholder.com/70";
            const desc = (p.description || "")
                .replace(/"/g, '&quot;')
                .substring(0, 200);

            table.insertAdjacentHTML("beforeend", `
            <tr data-bs-toggle="tooltip" data-bs-title="${desc}">
                <td>${p.id}</td>
                <td>${p.title}</td>
                <td>$${p.price}</td>
                <td>${p.category?.name || "N/A"}</td>
                <td>
                <img src="${img}" class="product-img"
                    onerror="this.src='https://via.placeholder.com/70'">
                </td>
            </tr>
            `);
        });

        document.querySelectorAll('[data-bs-toggle="tooltip"]')
            .forEach(el => new bootstrap.Tooltip(el));
    }


    // ========= SORT =========
    function sortByTitle() {
        filteredProducts.sort((a, b) =>
            titleAsc
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title)
        );

        titleAsc = !titleAsc;
        currentPage = 1;
        render();
    }

    function sortByPrice() {
        filteredProducts.sort((a, b) =>
            priceAsc ? a.price - b.price : b.price - a.price
        );

        priceAsc = !priceAsc;
        currentPage = 1;
        render();
    }


    // ========= PAGINATION =========
    function renderPagination() {

        const totalPages = Math.ceil(filteredProducts.length / pageSize);
        const pag = document.getElementById("pagination");
        pag.innerHTML = "";

        if (totalPages <= 1) return;

        pag.innerHTML += `
        <li class="page-item ${currentPage===1?"disabled":""}">
        <button class="page-link" onclick="gotoPage(${currentPage-1})">
            Prev
        </button>
        </li>`;

        for (let i=1;i<=totalPages;i++) {
            pag.innerHTML += `
            <li class="page-item ${i===currentPage?"active":""}">
                <button class="page-link" onclick="gotoPage(${i})">${i}</button>
            </li>`;
        }

        pag.innerHTML += `
        <li class="page-item ${currentPage===totalPages?"disabled":""}">
        <button class="page-link" onclick="gotoPage(${currentPage+1})">
            Next
        </button>
        </li>`;
    }

    function gotoPage(p) {
        const totalPages = Math.ceil(filteredProducts.length / pageSize);
        if (p < 1 || p > totalPages) return;
        currentPage = p;
        render();
    }


    // ========= SEARCH =========
    document.getElementById("searchBox").addEventListener("input", e => {

        const key = e.target.value.toLowerCase();

        filteredProducts = allProducts.filter(p =>
            p.title.toLowerCase().includes(key)
        );

        currentPage = 1;
        render();
    });


    // ========= PAGE SIZE =========
    document.getElementById("pageSize").addEventListener("change", e => {
        pageSize = parseInt(e.target.value);
        currentPage = 1;
        render();
    });


    loadProducts();
