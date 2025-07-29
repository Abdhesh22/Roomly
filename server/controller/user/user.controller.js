const PaymentService = require("../../services/payment/payment.service");
const UserService = require("../../services/user/user.service");
const { httpStatus } = require("../../utilities/constants/httpstatus.constant");
const { toaster } = require("../../utilities/messages/toaster.messages");

class UserController {
  checkEmail = async (req, res) => {
    try {

      const { userType } = req.query;
      const { email } = req.params;
      const userService = new UserService();

      const isEmailExist = await userService.findUserByEmail({ email, userType });
      if (isEmailExist) {
        return res.status(httpStatus.BAD_REQUEST).json({ status: false, isEmailExist: true, message: toaster.EMAIL_EXIST });
      }

      return res.status(httpStatus.OK).json({ status: true, isEmailExist: false });
    } catch (error) {
      console.log("error: ", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: true });
    }
  }

  checkout = async (req, res) => {
    try {

      const { user } = req;
      const bookingDetails = {
        userId: "68811446d7dea3ffff6611e9",
        basePrice: 6000,
        roomId: 1,
        nightCount: 2,
        items: [
          { name: "Extra Adult", price: 1000, quantity: 1 },
          { name: "Extra Child", price: 500, quantity: 1 }
        ]
      };


      const paymentService = new PaymentService();

      const customer = await paymentService.createCustomer(user);
      const order = await paymentService.generateOrder(customer, bookingDetails);

      return res.status(httpStatus.OK).json({ status: true, isEmailExist: false, order, customer, user });
    } catch (error) {
      console.log(error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: true });
    }
  }
}
module.exports = new UserController();
