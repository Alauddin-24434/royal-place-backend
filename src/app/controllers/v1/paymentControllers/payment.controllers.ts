import { Request, Response } from "express";
import { catchAsyncHandeller } from "../../../utils/handeller/catchAsyncHandeller";
import sanitize from "mongo-sanitize";

import { generatePaymentHtml } from "../../../views/payment.template";
import { paymentServices } from "../../../services/v1/paymentServices/payment.services";

// ======================================================================Payment Verify with Success======================================================================


const paymentSuccess = catchAsyncHandeller(async (req: Request, res: Response) => {
    const { transactionId } = req.query;
    const cleanTransactionId = sanitize(transactionId);


    const payment = await paymentServices.paymentVerify(cleanTransactionId as string);




    // Compact Royal Place payment success page
    res.send(generatePaymentHtml("success", payment?.transactionId as string));

});



// ===============================================================Payment Faild===================================================================

const paymentFail = catchAsyncHandeller(async (req: Request, res: Response) => {
    const { transactionId } = req.query;
    const cleanTransactionId = sanitize(transactionId);


    const payment = await paymentServices.paymentFail(
        cleanTransactionId as string
    );


    // Compact Royal Place payment success page
    res.send(generatePaymentHtml("failed", payment?.transactionId as string));


});
// ===============================================================Payment Cancel===================================================================
const paymentCancel = catchAsyncHandeller(async (req: Request, res: Response) => {

    const { transactionId } = req.query;

    const cleanTransactionId = sanitize(transactionId);

    await paymentServices.paymentCancel(cleanTransactionId as string);

    res.send(generatePaymentHtml("cancelled"));

});


const getPayments = catchAsyncHandeller(async (req, res) => {
    const { page, limit, status, searchTerm } = req.query;

    const result = await paymentServices.getPayments({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        status: typeof status === "string" ? status : "all",
        searchTerm: typeof searchTerm === "string" ? searchTerm : "",
    });

    res.status(200).json(result);
});



const getPaymentsByUserId = catchAsyncHandeller(async (req, res) => {
    const { id } = req.params;
    console.log("userId",id)
    const result = await paymentServices.paymentsGetByUserId(id);

    res.status(200).json({
        sucess: true,
        data: result
    })
});






// ======================Export controller=============================
export const paymentController = {
    getPayments,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    getPaymentsByUserId

};
