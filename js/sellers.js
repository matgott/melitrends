const trendsOffset = 20;

const getItem = async (id) => {
    const url = `https://api.mercadolibre.com/items/${id}`;
    const response = await fetch(url);
    return await response.json();
}

const getUser = async (id) => {
    const url = `https://api.mercadolibre.com/users/${id}`;
    const response = await fetch(url);
    return await response.json();
}

const isValidUrl = (string) => {
    try {
        const u = new URL(string);
        return u;
    } catch (_) {
        return false;  
    }
}

const drawTrasactionChart = (transaction) => {
    let ctx = document.getElementById('transaction-chart').getContext('2d');

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Canceladas", "Completadas"],
            datasets: [{
                data: [transaction.canceled, transaction.completed],
                backgroundColor: ["#f73", "#00a650"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                text: "Transacciones del vendedor",
                display: true
            }
        }
    });
}

const drawRatingChart = (transaction) => {
    let ctx = document.getElementById('rating-chart').getContext('2d');

    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Negativa", "Neutral", "Positiva"],
            datasets: [{
                data: [transaction.ratings.negative * 100, transaction.ratings.neutral * 100, transaction.ratings.positive * 100],
                backgroundColor: ["#f73", "gray", "#00a650"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                text: "Clasificación de transacciones",
                display: true
            },
            tooltips: {
                callbacks: {
                    label: (tooltip, data) => {
                        const i = tooltip.index;
                        const d = tooltip.datasetIndex;

                        let label = data.labels[i];
                        label += " " + data.datasets[d].data[i] + "%";
                        return label;
                    }
                }
            }
        }
    });
}

document.getElementById("navigation-action").addEventListener("click", async (e) => {
    let url = document.getElementById("navigation-url").value;
    if (url = isValidUrl(url)) {
        const re = new RegExp(/MLA-[0-9]*/gm);
        const matches = re.exec(url.pathname);
        if(matches.length > 0) {
            const itemId = matches[0].replace(/-/g, "");
            const item = await getItem(itemId);
            const sellerId = item.seller_id;
            const seller = await getUser(sellerId);
            drawTrasactionChart(seller.seller_reputation.transactions);
            drawRatingChart(seller.seller_reputation.transactions);
        }
    }
});

(function() {
    
})();