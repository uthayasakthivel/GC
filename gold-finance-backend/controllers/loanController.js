import { getNextLoanId } from "../utils/getNextLoanId.js";
import Loan from "../models/Loan.js";

export const getNextLoanIdApi = async (req, res) => {
  console.log("🔥 Entered getNextLoanIdApi");
  try {
    const branchCode = req.query.branchCode;
    if (!branchCode) {
      return res
        .status(400)
        .json({ message: "branchCode query parameter is required" });
    }

    const nextLoanId = await getNextLoanId(branchCode);
    res.json({ loanId: nextLoanId });
  } catch (err) {
    console.error("getNextLoanIdApi error:", err);
    res.status(500).json({ message: "Failed to get next loan ID" });
  }
};

export const createLoan = async (req, res) => {
  try {
    const {
      branches,
      customerData,
      customerId,
      address,
      aadharNumber,
      selectedBranch,
      jewelleryOptions,
      ratePerGram,
      loanAmount,
      selectedInterestRate,
      loanDate,
      loanPeriod,
      dueDate,
      noOfDays,
      selectedFactor,
      totalInterest,
      paymentMethod,
      paymentByOffline,
      paymentByOnline,
      refNumber,
      sheetPreparedBy,
      previewData,
      nextLoanNumber,
    } = req.body;

    const loan = new Loan({
      loanId: nextLoanNumber,
      customerId,
      branches: JSON.parse(branches || "[]"),
      selectedBranch,
      customerData: JSON.parse(customerData || "{}"),
      address,
      aadharNumber,
      jewelleryOptions: JSON.parse(jewelleryOptions || "[]"),
      ratePerGram,
      loanAmount,
      selectedInterestRate,
      loanDate,
      loanPeriod,
      dueDate,
      noOfDays,
      selectedFactor,
      totalInterest,
      paymentMethod,
      paymentByOffline,
      paymentByOnline,
      refNumber,
      sheetPreparedBy,
      previewData: JSON.parse(previewData || "{}"),
      images: {
        customerPhoto: req.files?.customerPhoto?.[0]?.path || null,
        jewelPhoto: req.files?.jewelPhoto?.[0]?.path || null,
        aadharPhoto: req.files?.aadharPhoto?.[0]?.path || null,
        declarationPhoto: req.files?.declarationPhoto?.[0]?.path || null,
        otherPhoto: req.files?.otherPhoto?.[0]?.path || null,
      },
    });

    await loan.save();
    res
      .status(201)
      .json({ success: true, message: "Loan created successfully", loan });
  } catch (error) {
    console.error("Error creating loan:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all loans
export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 }); // latest first
    res.json({ success: true, loans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch loans" });
  }
};

// Get latest 5 loans
export const getLatestLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 }).limit(5);
    res.json({ success: true, loans });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch latest loans" });
  }
};

// Get loan by ID
export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan)
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    res.json({ success: true, loan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch loan" });
  }
};

// Update loan
export const updateLoan = async (req, res) => {
  try {
    const files = req.files || {};
    const updateData = {
      ...req.body,
      customerPhoto: files.customerPhoto?.[0]?.filename,
      jewelPhoto: files.jewelPhoto?.[0]?.filename,
      aadharPhoto: files.aadharPhoto?.[0]?.filename,
      declarationPhoto: files.declarationPhoto?.[0]?.filename,
      otherPhoto: files.otherPhoto?.[0]?.filename,
    };

    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedLoan)
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    res.json({ success: true, loan: updatedLoan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update loan" });
  }
};

// Delete loan
export const deleteLoan = async (req, res) => {
  try {
    const deletedLoan = await Loan.findByIdAndDelete(req.params.id);
    if (!deletedLoan)
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    res.json({ success: true, message: "Loan deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete loan" });
  }
};

// PATCH /loan/:id/pay-interest
export const payInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidDate } = req.body; // ✅ Optional

    const loan = await Loan.findById(id);

    if (!loan) {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }

    const updateDate = paidDate ? new Date(paidDate) : new Date(); // ✅ Use provided date or today

    loan.lastInterestPaidDate = updateDate;

    await loan.save();

    res.json({
      success: true,
      message: "Interest paid successfully",
      loan,
    });
  } catch (error) {
    console.error("Error paying interest:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /loan/:id/pay-principal
export const payPrincipal = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidDate, newLoanAmount } = req.body; // Expect payment date and updated loan amount

    const loan = await Loan.findById(id);

    if (!loan) {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }

    // Update fields
    loan.lastInterestPaidDate = paidDate ? new Date(paidDate) : new Date();
    loan.loanAmount = newLoanAmount;

    if (newLoanAmount <= 0) {
      loan.status = "loanclosed";
    }

    await loan.save();

    res.json({
      success: true,
      message: "Principal payment processed successfully",
      loan,
    });
  } catch (error) {
    console.error("Error in payPrincipal:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
