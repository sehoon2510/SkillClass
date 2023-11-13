// php
function ajax(method, url, data = null) {
    return new Promise( (res, rej) => {
        let req = new XMLHttpRequest();
        req.open(method, url);
        req.addEventListener("readystatechange", e => {
            if(req.readyState == XMLHttpRequest.DONE) {
                let json = JSON.parse(req.responseText);
                if(req.status == 200)
                {
                    res(json);
                } else {
                    rej(json);
                }
            }
        });
        if(data != null)
			req.send(data);
		else 
			req.send();
    });
}

// xml
function xml(method, url, data = null) {
    return new Promise((res, rej) => {
        let req = new XMLHttpRequest();
        req.open(method, url);
        req.addEventListener("readystatechange", (e) => {
            if (req.readyState == XMLHttpRequest.DONE) {
                let response = req.responseText;
                if (req.status == 200) {
                    // Parse the XML response
                    let parser = new DOMParser();
                    let xml = parser.parseFromString(response, "text/xml");
                    res(xml);
                } else {
                    rej(response);
                }
            }
        });
        if (data != null) req.send(data);
        else req.send();
    });
}