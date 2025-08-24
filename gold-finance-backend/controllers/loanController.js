import { getNextLoanId } from "../utils/getNextLoanId.js";
import Loan from "../models/Loan.js";

export const getNextLoanIdApi = async (req, res) => {
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

export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, loans });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan)
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });

    res.status(200).json({ success: true, loan });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan)
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });

    const updates = req.body;

    // If images are updated
    if (req.files) {
      if (req.files.customerPhoto)
        loan.images.customerPhoto = req.files.customerPhoto[0].path;
      if (req.files.jewelPhoto)
        loan.images.jewelPhoto = req.files.jewelPhoto[0].path;
      if (req.files.aadharPhoto)
        loan.images.aadharPhoto = req.files.aadharPhoto[0].path;
      if (req.files.declarationPhoto)
        loan.images.declarationPhoto = req.files.declarationPhoto[0].path;
      if (req.files.otherPhoto)
        loan.images.otherPhoto = req.files.otherPhoto[0].path;
    }

    Object.assign(loan, updates);

    await loan.save();
    res
      .status(200)
      .json({ success: true, message: "Loan updated successfully", loan });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan)
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });

    res
      .status(200)
      .json({ success: true, message: "Loan deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
