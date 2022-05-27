class Main{
    static Login (){
        $.ajax({
            type : "POST",
            async : "false",
            url : "https://app.dipendo.com/oauth/token",
            data : `username=huseyinyilmaz@celsancelik.com&password=asdasd528&grant_type=password&client_id=DipendoWeb`,
        }).then(response => {
            localStorage.setItem("Authorization", response.token_type+' '+response.access_token);
        })
    }
}