let biler = [];

fetch("https://api.jsonbin.io/b/62024189f77b236211f09a9d")
    .then(function (data){
        return data.json();
    })
    .then(function (post){
        biler = post.billiste;
    })

const sektion = document.getElementById("bil_sektion");
const skabelon = document.getElementById("skabelon_output");
const personer = document.getElementById("personer");
const kufferter = document.getElementById("kufferter");
const formular = document.getElementById("formular");
const afhentningsdato = document.getElementById("afhentning");
const afleveringsdato = document.getElementById("aflevering");

formular.addEventListener("submit", function (event){
    event.preventDefault();
    if (valideDatoer(afhentningsdato.value, afleveringsdato.value)) {
        sektion.innerHTML = "";
        for (const bil of biler){
            if (kufferter.value <= bil.kufferter && personer.value <= bil.personer){
                const antaldage = beregnAntalLejedage(afhentningsdato.value, afleveringsdato.value);
                const klon = skabelon.content.cloneNode(true);
                const bilMM = klon.querySelector(".bilMM");
                const billedtag = klon.querySelector("img");
                const kategori = klon.querySelector(".kategori");
                const antalpersoner = klon.querySelector(".antalpersoner");
                const antalkufferter = klon.querySelector(".antalkufferter");
                const lejeudgift = klon.querySelector(".lejeudgift");

                billedtag.src = bil.billede;
                billedtag.alt = bil.billedetekst;
                bilMM.textContent = bil.bilmaerke;
                kategori.textContent += bil.kategori;
                antalpersoner.textContent += bil.personer;
                antalkufferter.textContent += bil.kufferter;
                lejeudgift.textContent = beregnLejeudgift(antaldage, bil.biltillaeg);
                
                sektion.appendChild(klon);
            }
        }   
} else{
    sektion.innerText = "Vælg en afleveringsdato som ligger efter afhentningsdato" 
}
})

function valideDatoer(afhentningsdato, afleveringsdato){
    const afhentning = new Date (afhentningsdato);
    const aflevering = new Date (afleveringsdato);
    if (afhentning > aflevering){
        return false;
    } else{
        return true;
    }
};

function beregnAntalLejedage(afhentningsdato, afleveringsdato){
    const AFHENTNING = new Date (afhentningsdato);
    const AFLEVERING = new Date (afleveringsdato);
    const FORSKELITID = AFLEVERING.getTime() - AFHENTNING.getTime();
    const FORSKELIDAGE = FORSKELITID / (1000 * 3600 * 24) + 1;
    return FORSKELIDAGE;
}

function beregnLejeudgift(antaldage, biltillaeg){
    const MOMS = 0.25;
    const GRUNDBELOEB = 495;
    const PRISPRDAG = 100;
    const LEJEUDGIFT = (GRUNDBELOEB + (antaldage * PRISPRDAG) + (antaldage * biltillaeg)) * (1 + MOMS);
    return LEJEUDGIFT.toFixed(2);
}

