import { getNextLoanId } from "../utils/getNextLoanId.js";
import Loan from "../models/Loan.js";
import Branch from "../models/Branch.js";

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
      jewels,
      eligibleAmount,
      totalEligibleAmount,
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
      jewels: JSON.parse(jewels || "[]"), // ✅ Save parsed jewels
      eligibleAmount,
      totalEligibleAmount: Number(totalEligibleAmount) || 0, // ✅ Save total eligibility
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

// export const createLoan = async (req, res) => {
//   try {
//     const {
//       branches,
//       customerData,
//       customerId,
//       address,
//       aadharNumber,
//       selectedBranch,
//       jewelleryOptions,
//       ratePerGram,
//       loanAmount,
//       selectedInterestRate,
//       loanDate,
//       loanPeriod,
//       dueDate,
//       noOfDays,
//       selectedFactor,
//       totalInterest,
//       paymentMethod,
//       paymentByOffline,
//       paymentByOnline,
//       refNumber,
//       sheetPreparedBy,
//       previewData,
//       nextLoanNumber,
//       jewels, // ✅ New
//       totalEligibleAmount, // ✅ New
//     } = req.body;

//     const loan = new Loan({
//       loanId: nextLoanNumber,
//       customerId,
//       branches: JSON.parse(branches || "[]"),
//       selectedBranch,
//       customerData: JSON.parse(customerData || "{}"),
//       address,
//       aadharNumber,
//       jewelleryOptions: JSON.parse(jewelleryOptions || "[]"),
//       ratePerGram,
//       loanAmount,
//       selectedInterestRate,
//       loanDate,
//       loanPeriod,
//       dueDate,
//       noOfDays,
//       selectedFactor,
//       totalInterest,
//       paymentMethod,
//       paymentByOffline,
//       paymentByOnline,
//       refNumber,
//       sheetPreparedBy,
//       previewData: JSON.parse(previewData || "{}"),
//       images: {
//         customerPhoto: req.files?.customerPhoto?.[0]?.path || null,
//         jewelPhoto: req.files?.jewelPhoto?.[0]?.path || null,
//         aadharPhoto: req.files?.aadharPhoto?.[0]?.path || null,
//         declarationPhoto: req.files?.declarationPhoto?.[0]?.path || null,
//         otherPhoto: req.files?.otherPhoto?.[0]?.path || null,
//       },
//       Jewels: JSON.parse(jewels || "[]"),
//       totalEligibleAmount: Number(totalEligibleAmount) || 0, // ✅ New
//     });

//     await loan.save();
//     res
//       .status(201)
//       .json({ success: true, message: "Loan created successfully", loan });
//   } catch (error) {
//     console.error("Error creating loan:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server error", error: error.message });
//   }
// };

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

// Helper to get branch code from loan's selectedBranch field

// Helper to resolve branch code from loan's selectedBranch
async function getBranchCode(loan) {
  let selectedBranch = loan.selectedBranch;

  if (typeof selectedBranch === "string") {
    try {
      const parsed = JSON.parse(selectedBranch);
      if (typeof parsed === "object" && parsed._id) {
        selectedBranch = parsed;
      }
    } catch (err) {
      // Not JSON, keep as is
    }
  }

  if (typeof selectedBranch === "object" && selectedBranch._id) {
    return selectedBranch.code || selectedBranch._id.toString();
  }

  if (typeof selectedBranch === "string") {
    const branchDoc = await Branch.findById(selectedBranch);
    if (!branchDoc) throw new Error("Branch not found for loan");
    return branchDoc.code;
  }

  throw new Error("Invalid selectedBranch in loan");
}

// ✅ Partial Payment and Split Loan
export const payPartialAndSplitLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { partialJewelOrnament, paidDate } = req.body;

    // Fetch old loan
    const oldLoan = await Loan.findById(id).populate("selectedBranch");
    if (!oldLoan)
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });

    console.log("Fetched OLD loan:", oldLoan);

    if (oldLoan.partialReleaseAllowed === false) {
      return res
        .status(403)
        .json({ success: false, message: "Partial release not allowed." });
    }

    const releaseDate = paidDate ? new Date(paidDate) : new Date();

    // Find jewel to release
    const releasedJewel = oldLoan.jewels.find(
      (j) => j.ornament === partialJewelOrnament
    );
    if (!releasedJewel)
      return res
        .status(400)
        .json({ success: false, message: "Jewel not found." });

    // Add release metadata
    const releasedJewelWithMeta = {
      ...(releasedJewel.toObject ? releasedJewel.toObject() : releasedJewel),
      released: true,
      releasedFromLoanId: oldLoan._id,
      releasedDate: releaseDate,
    };

    console.log("Released jewel with metadata:", releasedJewelWithMeta);

    // Remaining jewels for new loan
    const remainingJewels = oldLoan.jewels.filter(
      (j) => j.ornament !== partialJewelOrnament
    );
    console.log("Remaining jewels for NEW loan:", remainingJewels);

    // Recalculate partials
    const totalEligible = remainingJewels.reduce(
      (sum, j) => sum + (j.eligibleAmount || 0),
      0
    );
    const newLoanAmount =
      (oldLoan.loanAmount || 0) - (releasedJewel.partial || 0);
    const recalculatedJewels = remainingJewels.map((j) => ({
      ...(j.toObject ? j.toObject() : j),
      partial:
        totalEligible > 0
          ? Math.round(
              (newLoanAmount * j.eligibleAmount) / totalEligible / 1000
            ) * 1000
          : 0,
    }));

    // ---------- Update OLD loan ----------
    oldLoan.jewels = [releasedJewelWithMeta]; // only released jewel
    oldLoan.partialReleaseAllowed = false;
    oldLoan.partialReleaseStatus = "released";
    oldLoan.status = "loanclosed";
    oldLoan.lastInterestPaidDate = releaseDate;
    await oldLoan.save();

    console.log("OLD loan after save:", await Loan.findById(oldLoan._id));

    // ---------- Create NEW loan ----------
    const newLoanId = await getNextLoanId(await getBranchCode(oldLoan));

    const newLoan = new Loan({
      loanId: newLoanId,
      customerId: oldLoan.customerId,
      branches: oldLoan.branches,
      selectedBranch: oldLoan.selectedBranch,
      customerData: oldLoan.customerData,
      address: oldLoan.address,
      aadharNumber: oldLoan.aadharNumber,
      jewels: recalculatedJewels, // only remaining jewels
      ratePerGram: oldLoan.ratePerGram,
      loanAmount: newLoanAmount,
      eligibleAmount: totalEligible,
      selectedInterestRate: oldLoan.selectedInterestRate,
      loanDate: new Date().toISOString(),
      loanPeriod: oldLoan.loanPeriod,
      dueDate: oldLoan.dueDate,
      noOfDays: oldLoan.noOfDays,
      selectedFactor: oldLoan.selectedFactor,
      totalInterest: 0,
      paymentMethod: oldLoan.paymentMethod,
      status: recalculatedJewels.length === 0 ? "loanclosed" : "loanopen",
      images: oldLoan.images,
      previewData: oldLoan.previewData,
      lastInterestPaidDate: releaseDate,
      linkedToLoanId: oldLoan._id,
    });

    await newLoan.save();
    console.log("NEW loan created:", newLoan);

    return res.status(201).json({
      success: true,
      message: "Partial payment processed, new loan created",
      oldLoan,
      newLoan,
    });
  } catch (err) {
    console.error("Error in payPartialAndSplitLoan:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
