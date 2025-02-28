// lambda handler
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

return {
            statusCode: 400,
            body: JSON.stringify('API call successful')
        }
    }
export { handler }