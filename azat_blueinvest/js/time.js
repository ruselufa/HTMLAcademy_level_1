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
    //������� ��� 19-23, ��� +3 ������������ UTC
    if ( date.getUTCHours() >= 16 ) {
        date.setDate( date.getDate() + 1 );
    }
    return date;
}

function getFormattedDate( date ) {
    date = moveDay( date );

    const monthNames = ["������", "�������", "�����", "������", "���",
        "����", "����", "�������", "��������", "�������", "������", "�������"
    ];

    //��������� �������������� ����:
    //	long - ������ ��������
    //	numeric - �������� �������������
    const dateFormatOptions = { month: 'long', day: 'numeric' };

    if ( toLocaleDateStringSupportsLocales() ) {
        return date.toLocaleDateString( 'ru-RU', dateFormatOptions );
    } else {
        //��������� Safari � Internet Explorer �� 11 ������
        return date.getDate() + ' ' + monthNames[date.getMonth()];
    }
}

//�������� ��������� ��������������� ������� ����
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
        //API ��� ��������� ������� � ���������� ��������� ����
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
            console.log( '������ ' + this.status );
            resolve( new Date() );
        }

        xhr.send();
    });
}