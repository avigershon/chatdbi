// import { Sequelize } from '@sequelize/core';
// import { SnowflakeDialect } from '@sequelize/snowflake';
// import snowflake from 'snowflake-sdk'

// const {
//     // SNOWFLAKE_DB: database,
//     // SNOWFLAKE_SCHEMA: schema,
//     SNOWFLAKE_KEY_PATH: privateKeyPath,
//     SNOWFLAKE_KEY_PASSWORD: privateKeyPass,
//     SNOWFLAKE_USER: username,
//     SNOWFLAKE_ACCOUNT: account,
//     SNOWFLAKE_ROLE: role,
//     SNOWFLAKE_WAREHOUSE: warehouse,
// } = process.env;

// const config = {
//     // dialect: SnowflakeDialect,
//     authenticator: 'SNOWFLAKE_JWT',
//     // accessUrl: 'https://whsdpnonprod.eu-west-1.snowflakecomputing.com',
//     account,
//     role,
//     warehouse,
//     username,
//     privateKeyPath,
//     privateKeyPass,
// };

// import { WEBUI_API_BASE_URL, WEBUI_BASE_URL } from '$lib/constants';

export type ExecuteSqlForm = {
	sql: string;
};

export const executeSql = async (body: ExecuteSqlForm) => {
	let error = null;

	const res = await fetch(`/api/workers/snowflake`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			const snowflake_response=await res.json();
			try {
				// JSON.parse(snowflake_response);
				return jsonToHtmlTable(snowflake_response);
			} catch (e) {
				return snowflake_response;
			}
			
		})
		.catch((err) => {
			console.log(err);
			if ('detail' in err) {
				error = err.detail;
			} else {
				error = err;
			}
			return null;
		});

	if (error) {
		throw error;
	}

	return res;
};

function jsonToHtmlTable(jsonArray: Array<Record<string, any>>, height: string = '400px'): string {
    if (jsonArray.length === 0) {
        return "<table><tr><td>No data available</td></tr></table>";
    }

    const headers = Object.keys(jsonArray[0]);

    let html = `
    <div class="scrollbar-hidden relative whitespace-nowrap overflow-x-auto max-w-full">
        <table class="w-full">
            <thead>
                <tr>${headers.map(header => `<th style="text-align: null">${header}</th>`).join('')}</tr>
            </thead>
            <tbody>
                ${jsonArray.map(row => `
                    <tr>
                        ${headers.map(header => `<td>${row[header] ?? ""}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>`;
    
    return html;
}


// export const executeSql = async (sql) => {
//     // const sequelize = new Sequelize(config);
//     const payload = {
//         sql: sql
//     };
  
//     try {
//         const response = await fetch(`/execute-sql`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(payload)
//         });
    
//         if (!response.ok) {
//           // Handle non-2xx HTTP responses
//           const errorData = await response.json();
//           console.error("Error executing SQL:", errorData);
//           return errorData;
//         }
    
//         const data = await response.json();
//         console.log("Response:", data);
//         return data;
//       } catch (error) {
//         console.error("Error executing SQL:", error.message);
//         return { error: error.message };
//       }
//     // return '<table class="w-full"><tr><th>Column1</th><th>Column2</th><th>Column3</th><th>Column4</th><th>Column5</th><th>Column6</th><th>Column7</th><th>Column8</th><th>Column9</th><th>Column10</th></tr><tr><td>100</td><td>200</td><td>300</td><td>400</td><td>500</td><td>600</td><td>700</td><td>800</td><td>900</td><td>1000</td></tr><tr><td>110</td><td>220</td><td>330</td><td>440</td><td>550</td><td>660</td><td>770</td><td>880</td><td>990</td><td>1110</td></tr><tr><td>120</td><td>240</td><td>360</td><td>480</td><td>600</td><td>720</td><td>840</td><td>960</td><td>1080</td><td>1200</td></tr></table>'; //await sequelize.query(sql, { type: QueryTypes.SELECT });
// };

module.exports = {
    executeSql,
};