import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root"));


/* eslint-disable */

String.prototype.formatUnicorn = String.prototype.formatUnicorn || function () {
    let str = this.toString();
    if ( arguments.length ) {
        const t = typeof ( arguments[ 0 ] );
        let key;
        const args = t === "string" || t === "number" ? Array.prototype.slice.call( arguments ) : arguments[ 0 ];

        for ( key in args ) {
            str = str.replace( new RegExp( `\\{${key}\\}`, "gi" ), args[ key ] );
        }
    }

    return str;
};

String.prototype.hashCode = function () {
    let hash = 0;
    if ( this.length == 0 ) return hash;
    for ( let xi = 0; xi < this.length; xi++ ) {
        const char = this.charCodeAt( xi );
        hash = ( hash << 5 ) - hash + char;
        hash &= hash; // Convert to 32bit integer
    }
    return hash;
};
/* eslint-enable */
registerServiceWorker();
