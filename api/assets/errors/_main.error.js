import { Telegram } from "../../helpers/telegram";
import tick from '../../helpers/tick';

export class MainError extends Error{
    constructor (title,code,error){
        super(error ? error.message : 'Sin descripción');
        this._title = title;
        this._code = code;
        this._time = tick().format('DD.MM.YYYY HH:mm:ss');
    }

    toJSON(){
        return{
            title:this._time,
            message:this.message,
            HTTPCode:this._code,
            time:this._time,
        };
    }

    notify(){
        let e=this.toJSON()
        if(e.location==null){
            Telegram.sendMessage(
                `<b>Error : </b><i>${e.title}</i>
                <b>Message : </b><i>${e.message}</i>
                <b>HTTPCode : </b><i>${e.HTTPCode}</i>
                <b>time : </b><i>${e.time}</i>`
            );
        }else{
            Telegram.sendMessage(
                `<b>Error : </b><i>${e.title}</i>
                <b>Message : </b><i>${e.message}</i>
                <b>HTTPCode : </b><i>${e.HTTPCode}</i>
                <b>time : </b><i>${e.time}</i>
                <b>operation : </b><i>${e.location.operation}</i>
                <b>stacktrace : </b><i>${e.location.stacktrace}</i>`
            );
        }
    }

    logger(){
        this.notify()
    }
}