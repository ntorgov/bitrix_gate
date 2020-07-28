//const axios = require('axios');
import axios, {AxiosResponse} from "axios";

export class Bitrix {

    BITRIX_HOST = 'https://webclassic.bitrix24.ru/rest/122/f6ecshxdtphunn6d/';

    constructor() {
        console.log('Init');
    }

    public GetChannelMessages(channelId: string) {
        let method = 'im.dialog.messages.get';

        let data = this.makeRequest(method, {DIALOG_ID: 'chat' + channelId});

        return data;
    }

    private makeRequest(method: string, data: any) {
        const client = axios({
                method: 'POST',
                url: 'https://webclassic.bitrix24.ru/rest/122' + '/' + 'f6ecshxdtphunn6d' + '/' + method,
                data: data,
            },
        ).then(function (data: AxiosResponse<any>) {
            console.log(data);
            /**
             * Результаты
             * @type {BitrixChannelMessages}
             */
            let result = data.data.result;

            console.log(result);

            return data.data;
            //
            //
            // console.info(result.messages[0].text);
        });
    }
}

//export default Bitrix;