// src/components/SheetPreview.jsx
import React from "react";

export default function SheetPreview({ sheet, sheetType }) {
  return (
    <>
      {sheetType === "buying" ? (
        <div
          className="printable-content bg-white p-4 border rounded space-y-4 max-w-3xl mx-auto"
          style={{ backgroundColor: "white" }}
        >
          <div>
            <p>
              <strong>Name:</strong> {sheet.customerName}
            </p>
            <p>
              <strong>Phone number:</strong> {sheet.phoneNumber}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              <p>
                <strong>Date:</strong>{" "}
                {new Date(sheet.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </p>

            <p>
              <strong>Branch:</strong> {sheet.branchId?.name} -{" "}
              {sheet.branchId?.location}
            </p>
          </div>

          <div>
            <h3 className="font-bold">Gold Details</h3>
            <ul className="list-disc ml-4 space-y-1">
              <li>
                <strong>Article:</strong> {sheet.articleId.jewelleryName}
              </li>
              <li>
                <strong>Gross Weight:</strong> {sheet.goldDetails?.grossWeight}{" "}
                g
              </li>
              <li>
                <strong>Stone Weight:</strong> {sheet.goldDetails?.stoneWeight}{" "}
                g
              </li>
              <li>
                <strong>Net Weight:</strong> {sheet.goldDetails?.netWeight} g
              </li>
              <li>
                <strong>Purity:</strong> {sheet.goldDetails?.purity}%
              </li>
              <li>
                <strong>Rate:</strong> ₹
                {sheet.buyingRate || sheet.sellingRate || sheet.meltingRate}
              </li>
              <li>
                <strong>Net Amount:</strong> ₹{sheet.netAmount}
              </li>
              {sheet.amountDisbursedMethod === "both" ? (
                <li>
                  <strong>Payment Method:</strong> Online and Offline
                </li>
              ) : (
                <li>
                  <strong>Payment Method:</strong> {sheet.amountDisbursedMethod}
                </li>
              )}
              {sheet.amountDisbursedMethod === "online" && (
                <li>
                  <strong>Payment From Online:</strong> ₹
                  {sheet.amountFromOnline}
                </li>
              )}
              {sheet.amountDisbursedMethod === "offline" && (
                <li>
                  <strong>Payment From Offline:</strong> ₹
                  {sheet.amountFromOffline}
                </li>
              )}
              <li>
                <strong>Commission Person Name:</strong>{" "}
                {sheet.commission?.name}
              </li>
              <li>
                <strong>Commission Person Contact:</strong>{" "}
                {sheet.commission?.phone}
              </li>
              <li>
                <strong>Commission Amount:</strong> ₹{sheet.commission?.fixed}
              </li>
              <li>
                <strong>Miscellaneous:</strong> ₹{sheet.miscellaneousAmount}
              </li>
              <li>
                <strong>Total Spend:</strong> ₹{sheet.totalAmountSpend}
              </li>
              <li>
                <strong>Sheet Prepared By:</strong> {sheet.preparedBy}
              </li>
            </ul>
          </div>

          {/* Images */}
          {sheet.images && sheet.images.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">Uploaded Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sheet.images.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Uploaded ${idx + 1}`}
                    className="w-full h-40 object-cover border"
                    crossOrigin="anonymous"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : sheetType === "selling" ? (
        <div
          className="printable-content bg-white p-4 border rounded space-y-4 max-w-3xl mx-auto"
          style={{ backgroundColor: "white" }}
        >
          <div>
            <p>
              <strong>Buying Sheet:</strong> {sheet.buyingSheetNumber}
            </p>

            <p>
              <strong>Buyer Name:</strong> {sheet.customerName}
            </p>
            <p>
              <strong>Phone number:</strong> {sheet.phoneNumber}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(sheet.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
            <p>
              <strong>Address:</strong> {sheet.address}
            </p>
          </div>

          <div>
            <ul className="list-disc ml-4 space-y-1">
              <li>
                <strong>Article:</strong> {sheet.articleId.jewelleryName}
              </li>
              <li>
                <strong>Gross Weight:</strong> {sheet.goldDetails?.grossWeight}{" "}
                g
              </li>

              <li>
                <strong>Buying Rate:</strong> ₹
                {sheet.buyingRate || sheet.sellingRate || sheet.meltingRate}
              </li>
              <li>
                <strong>Selling Rate:</strong> ₹{sheet.goldDetails.sellingRate}
              </li>
              <li>
                <strong>Value Added:</strong> ₹{sheet.goldDetails.valueAdded}
              </li>
              <li>
                <strong>Net Amount:</strong> ₹{sheet.goldDetails.netAmount}
              </li>
              <li>
                <strong>Net Profit:</strong> ₹{sheet.goldDetails.netProfit}
              </li>
              {sheet.amountDisbursedMethod === "both" ? (
                <li>
                  <strong>Payment Method:</strong> Online and Offline
                </li>
              ) : (
                <li>
                  <strong>Payment Method:</strong> {sheet.amountDisbursedMethod}
                </li>
              )}
              {sheet.amountDisbursedMethod === "online" && (
                <li>
                  <strong>Payment From Online:</strong> ₹
                  {sheet.amountFromOnline}
                </li>
              )}
              {sheet.amountDisbursedMethod === "offline" && (
                <li>
                  <strong>Payment From Offline:</strong> ₹
                  {sheet.amountFromOffline}
                </li>
              )}

              <li>
                <strong>Sheet Prepared By:</strong> {sheet.preparedBy}
              </li>
            </ul>
          </div>

          {/* Images */}
          {sheet.images && sheet.images.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">Uploaded Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sheet.images.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Uploaded ${idx + 1}`}
                    className="w-full h-40 object-cover border"
                    crossOrigin="anonymous"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : sheetType === "melting" ? (
        <div
          className="printable-content bg-white p-4 border rounded space-y-4 max-w-3xl mx-auto"
          style={{ backgroundColor: "white" }}
        >
          <div>
            <p>
              <strong>Buying Sheet:</strong> {sheet.buyingSheetNumber}
            </p>
            <p>
              <strong>Melting Center:</strong> {sheet.meltingCenter}
            </p>
            <p>
              <strong>Melting Place:</strong> {sheet.meltingPlace}
            </p>
            <p>
              <strong>Melting Reference :</strong> {sheet.meltingRefPerson}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              <p>
                <strong>Date:</strong>{" "}
                {new Date(sheet.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </p>
          </div>

          <div>
            <ul className="list-disc ml-4 space-y-1">
              <li>
                <strong>Gross Weight:</strong> {sheet.goldDetails?.grossWeight}{" "}
                g
              </li>
              <li>
                <strong>After Stone Removal:</strong>{" "}
                {sheet.goldDetails?.afterStone} g
              </li>
              <li>
                <strong>After Melting:</strong>{" "}
                {sheet.goldDetails?.afterMelting} g
              </li>
              <li>
                <strong>Kaccha Purity:</strong>{" "}
                {sheet.goldDetails?.kacchaPurity} g
              </li>

              <li>
                <strong>Buying Rate:</strong> ₹{sheet.rateDetails.buyingRate}
              </li>
              <li>
                <strong>Selling Rate:</strong> ₹{sheet.rateDetails.sellingRate}
              </li>
              <li>
                <strong>Net Profit:</strong> ₹{sheet.rateDetails.netProfit}
              </li>
              {sheet.rateDetails.amountDisbursedMethod === "both" ? (
                <li>
                  <strong>Payment Method:</strong> Online and Offline
                </li>
              ) : (
                <li>
                  <strong>Payment Method:</strong>{" "}
                  {sheet.rateDetails.amountDisbursedMethod}
                </li>
              )}
              {sheet.rateDetails.amountDisbursedMethod === "online" && (
                <li>
                  <strong>Payment From Online:</strong> ₹
                  {sheet.rateDetails.amountFromOnline}
                </li>
              )}
              {sheet.rateDetails.amountDisbursedMethod === "offline" && (
                <li>
                  <strong>Payment From Offline:</strong> ₹
                  {sheet.rateDetails.amountFromOffline}
                </li>
              )}
              <li>
                <strong>Total Amount Recieved</strong> ₹
                {sheet.rateDetails.totalAmountRecieved}
              </li>

              <li>
                <strong>Sheet Prepared By:</strong> {sheet.preparedBy}
              </li>
            </ul>
          </div>

          {/* Images */}
          {sheet.images && sheet.images.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">Uploaded Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sheet.images.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Uploaded ${idx + 1}`}
                    className="w-full h-40 object-cover border"
                    crossOrigin="anonymous"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Unknown sheet type</p>
      )}
    </>
  );
}
