//const apiDev = 'http://localhost:3000';
const apiDev = 'https://selftour.travel/rest-api';
let cantInstalaciones, cantIos, cantAndroid, toursComprados;

/* Almacenar datos en el localStorage 'reports' */
const storeData = async () => {
    const url = `${apiDev}/app-reports`;
    const res = await fetch(url);
    const reports = await res.json();
    if(reports.msg) return console.log(reports.msg);
    localStorage.setItem('reports', JSON.stringify(reports));
}

/* Poblar pagina con los datos del localStorage */
const populatePage = async() => {
    await storeData();
    let stored = JSON.parse(localStorage.getItem('reports'));
    let { reports } = stored;
    instalacionesApp( reports) ;
    recenActivities( reports );
    ultimosToursComprados( reports );
}

/* Instalaciones de la app */
const instalacionesApp = data => {
    cantInstalaciones = data.filter( v => v.id_type === 1 );
    cantIos = cantInstalaciones.filter( v => v.extra.os === 'iOS' );
    cantAndroid = cantInstalaciones.filter( v => v.extra.os === 'Android' );
    document.getElementById('cant-install').innerText = cantInstalaciones.length;
    document.getElementById('ios-install').innerText = cantIos.length;
    document.getElementById('android-install').innerText = cantAndroid.length;
}

/* Ultimos tours comprados */
const ultimosToursComprados = data => {
    toursComprados = data.filter( tour => tour.id_type === 3 );
    let html = '';
    toursComprados.reverse().forEach( tour => {
        html = html + `<tr>
            <td>
                <div class="media">
                    <div class="square-box me-2"><img class="b-r-5" width"10px" height="auto" src="${tour.img_profile}" alt=""></div>
                    <div class="media-body ps-2">
                    <div class="avatar-details"><a href="product-page.html">
                        <h6>${tour.name}</h6></a><span>${tour.mail}</span></div>
                    </div>
                </div>
            </td>
            <td class="img-content-box">
                <h6>${tour.extra.title}</h6><span>In 6 Days</span>
            </td>
            <td>
                <h6>${formatearFecha(tour.recorded_at)}</h6><span>$7,800</span>
            </td>
        </tr>`
    })
    document.getElementById('ultimos_tours_comprados').innerHTML = html;
}

const formatearFecha = (date) => {
    let fecha = Date.parse(date)
    let milisecond = new Date(fecha)
    let year = milisecond.getFullYear();
    let month = milisecond.getMonth();
    let day = milisecond.getDate();
    return `${(day < 10 ) ? '0' + day : day}/${(month < 10) ? '0' + month : month}/${year}`;
}

/* Actividades Recientes */
const recenActivities = data => {
    let lastActivities = data.slice(data.length - 5).reverse();
    console.log(lastActivities);
    let html = '';
    lastActivities.forEach( activity => {
        let avatar = (activity.id_type === 1 && activity.iduser === null) 
            ? `/dashboard/assets/images/logo/${activity.extra.os}.svg` 
            : activity.img_profile;
        let dataUser = ( activity.id_type === 1 && activity.iduser === null ) 
            ? `OS: ${activity.extra.os}, Model: ${activity.extra.model}`
            : `${activity.name}`;
        html = html + `<tr>
            <td>
                <div class="media">
                    <img class="me-3 b-r-5" height="40px" width="auto" src=${avatar} alt="">
                    <div class="media-body">
                        <a href="blog-single.html">
                        <h5>${ activity.type_name }</h5></a>
                        <p>${ dataUser }</p>
                    </div>
                </div>
            </td>
            <td><span class="badge badge-light-theme-light font-theme-light">${formatearFecha( activity.recorded_at ) }</span></td>
        </tr>`
    });
    document.getElementById('recent_activities').innerHTML = html;
}

populatePage();