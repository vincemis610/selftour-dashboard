//const URL = 'http://localhost:3000';
const URL = 'https://selftour.travel/rest-api';

// Almacenar datos
const storeData = async () => {
    const url = `${URL}/tour-reports`;
    const res = await fetch(url);
    reports = await res.json();
    localStorage.setItem('reportsTour', JSON.stringify(reports));
}

// funcion que pobla la tabla de tours
const poblarTablaTours = (data) => {
    let html = '';
    data.map( (tour, idx) => { 
        let mailIcon = (tour.warnings.length > 1) ? `<icon data-toggle="tooltip" data-placement="top" title="Enviar pendientes" class="icon-email fa fa-envelope-o text-danger" onclick='sendEmail(event, ${JSON.stringify(tour)}, ${idx})'></icon>` : "";
        html = html + `<tr style="${(tour.status_tour === 1) ?'background-color:#eafaf1': 'background-color:#fbfcfc'}" id="tour-${tour.idtour}">
                <td style="cursor:pointer; font-weight:bold; font-size: 14px;">
                    <a style="text-decoration:none; color: #3498db" ${(tour.slug != null) ? `href='https://www.selftour.travel/tour/${tour.slug}'` : ''}>
                        ${ tour.title }
                    </a>
                </td>
                <td>${tour.tourmaker}</td>
                <td style="width:8%;">${(tour.cant_sitios === 0 ) ? '<icon class="fa fa-ban disable" data-toggle="tooltip" data-placement="top" title="El tour no contiene sitios"></icon>' : tour.cant_sitios }</td>
                <td style="width:8%;">${(tour.images === 0) ? '<icon class="fa fa-exclamation-triangle disable" data-toggle="tooltip" data-placement="top" title="El tour no tiene imagenes"></icon>' : tour.images}</td>
                <td>$ ${tour.price} ${tour.moneda}</td>
                <td style="width:8%;">${tour.ventas}</td>
                <td style="width:8%;">${ (tour.status_tour === 1) ? `<label class="switch">
                                                        <input type="checkbox" checked disabled data-warnings="${tour.warnings.join('|')}">
                                                        <span class="slider round" data-toggle="tooltip" data-placement="top" title="Deshabilitar tour"></span>
                                                        <icon class="icon-trash fa fa-trash-o" onclick='deleteTour(event)' data-toggle="tooltip" data-placement="top" title="Eliminar tour"></icon>
                                                        ${mailIcon}
                                                    </label>` 
                                                : `<label class="switch">
                                                        <input type="checkbox" disabled data-warnings="${tour.warnings.join('|')}">
                                                        <span class="slider round" data-toggle="tooltip" data-placement="top" title="Habilitar tour"></span>
                                                        <icon class="icon-trash fa fa-trash-o" onclick='deleteTour(event)' data-toggle="tooltip" data-placement="top" title="Eliminar tour"></icon>
                                                        ${mailIcon}
                                                    </label>`}
                </td>
                <td>${ tour.warnings.map( w => `<li style="${(w === 'Ok') ? 'color:#45b39d' : 'color:#e74c3c' }">${w}</li>`).join(' ') }</td>
            </tr>`
    });

    document.querySelector('#reporte-tour').innerHTML = html;
}

// Funcion que ejecuta la poblacion de la pagina y agrega evento
const poblarUI = async () => {
    await storeData();
    let reportsTour = JSON.parse(localStorage.getItem('reportsTour'));
    poblarTablaTours(reportsTour.report);

    const check = document.querySelectorAll('.switch .slider');
    check.forEach( val => val.addEventListener('click', event => enableDisable(event) ));
}

// Poblar pagina
poblarUI();

// Habilitar o Deshabilitar Tour
const enableDisable = (e) => {
    let element = e.target.previousElementSibling;
    console.log('HasAttribute: ',element.hasAttribute('checked'));
    (element.hasAttribute('checked')) ? disableTour(element) : enableTour(element);
}

// Deshabilitar Tour
disableTour = (element) => {
    let parent = element.parentNode.parentNode.parentNode;
    Swal.fire({
        title: 'Deshabilitar Tour?',
        text: "El tour no sera visible en la plataforma!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Deshabilitar'
    }).then((result) => {
        if (result.isConfirmed) {
            let  idtour = parent.id.split('-')[1];  
            fetch(`${URL}/tours/disable/${idtour}`, { method: 'PUT' })
                .then(response => response.json())
                .then(result => {
                    Swal.fire(
                        'Deshabilitado!',
                        'El tour ha sido deshabilitado.',
                        'success'
                    )
                    element.removeAttribute('checked');
                    element.setAttribute('data-warnings', 'Activar')
                    parent.style.backgroundColor = '#fbfcfc';
                    parent.lastElementChild.innerHTML = '<li style="color:#e74c3c">Activar</li>';
                })
                .catch(error => console.log('error', error))
        }
    });
}

// Habilitar Tour
enableTour = (element) => {
    let parent = element.parentNode.parentNode.parentNode;
    if(element.dataset.warnings === 'Activar'){
        Swal.fire({
            title: 'Habilitar Tour?',
            text: "El tour sera visible en la plataforma!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Habilitar'
        }).then((result) => {
            if (result.isConfirmed) {
                let  idtour = parent.id.split('-')[1]; 
                fetch(`${URL}/tours/enable/${idtour}`, { method: 'PUT' })
                    .then(response => response.json())
                    .then(result => {
                        Swal.fire(
                            'Habilitado!',
                            'El tour ha sido habilitado.',
                            'success'
                        )
                        element.setAttribute('checked', true);
                        parent.lastElementChild.innerHTML = '<li style="color:#45b39d">Ok</li>';
                        parent.style.backgroundColor = '#eafaf1';
                    })
            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Pendientes..!',
            html: `${element.dataset.warnings.split("|").join('<br>')}`
        }); 
    }
}


const deleteTour = (event) => {
    let element = event.target.parentNode.parentNode.parentNode;
    let idTour = element.id.split('-')[1];  
    Swal.fire({
        title: 'Eliminar Tour?',
        text: "El tour ya no se podra recuperar!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Eliminado!',
            'Removido exitosamente.',
            'success'
          );
          element.remove();
        }
      })
}   

const sendEmail = (event, tour, idx) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const dataTour = JSON.stringify( tour );

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: dataTour,
        redirect: 'follow'
    };

    Swal.fire({
        title: 'Enviar pendientes al tourmaker?',
     
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Enviar'
      }).then((result) => {
        if (result.isConfirmed) {
            /* event.target.classList.remove("text-danger");
            event.target.classList.add("text-primary") */
            fetch(`${URL}/sendPending`, requestOptions)
            .then(response => response.json())
            .then(result => {
                
                event.target.style.display = 'none';
                Swal.fire(
                    'Enviado!',
                    `${result.msg}`,
                    'success'
                )
            })
            .catch(error => console.log('error', error));
        }
      })
}
