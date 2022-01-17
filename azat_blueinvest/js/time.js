$(function() {
    getMoscowTime()
        .then( getFormattedDate )
        .then( setFormattedDate );
});

function setFormattedDate( date ) {
    $('#Date').html( date );
    $('#Date2').html( date );
}

function moveDay( date ) {
    //Текущий час 19-23, Мск +3 относительно UTC
    if ( date.getUTCHours() >= 16 ) {
        date.setDate( date.getDate() + 1 );
    }
    return date;
}

function getFormattedDate( date ) {
    date = moveDay( date );

    const monthNames = ["января", "февраля", "марта", "апреля", "мая",
        "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];

    //Настройка форматирования даты:
    //	long - полное название
    //	numeric - числовое представление
    const dateFormatOptions = { month: 'long', day: 'numeric' };

    if ( toLocaleDateStringSupportsLocales() ) {
        return date.toLocaleDateString( 'ru-RU', dateFormatOptions );
    } else {
        //Поддержка Safari и Internet Explorer до 11 версии
        return date.getDate() + ' ' + monthNames[date.getMonth()];
    }
}

//Проверка поддержки локализованного формата даты
function toLocaleDateStringSupportsLocales() {
    try {
        new Date().toLocaleDateString( 'i' );
    } catch ( e ) {
        return e.name === 'RangeError';
    }
    return false;
}

function getMoscowTime() {
    return new Promise( ( resolve, reject ) => {
        //API для получения времени в Московской временной зоне
        const api = 'https://api.timezonedb.com/v2.1/get-time-zone?key=TXSGDBDMD6Z0&format=json&by=zone&zone=Europe/Moscow';

        let date = new Date();

        setFormattedDate( getFormattedDate( date ) );

        XHR = ( 'onload' in new XMLHttpRequest() ) ? XMLHttpRequest : XDomainRequest;
        xhr = new XHR();

        xhr.open('GET', api, true);

        xhr.onload = function() {
            let response = JSON.parse( this.responseText );
            if ( response.formatted ) {
                //Only ISO format support on Safari
                date = new Date( response.formatted.replace( ' ', 'T' ) + '+03:00' );
                resolve( date );
            }
        }

        xhr.onerror = function() {
            console.log( 'Ошибка ' + this.status );
            resolve( new Date() );
        }

        xhr.send();
    });
}