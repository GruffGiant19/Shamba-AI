import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { LogEntry } from "./logService";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy"; // ✅ Use legacy API

interface ReportData {
  profile: any;
  logs: LogEntry[];
  timeRange: string;
  totalExpenses: number;
  totalYield: number;
  monthlyExpenses: { label: string; value: number }[];
  activityCounts: { label: string; value: number }[];
  cropExpenses: {
    crop: string;
    expenses: number;
    yield: number;
    activities: number;
  }[];
}

const formatCurrency = (amount: number) =>
  `GH₵ ${amount.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Convert logo to base64
const getLogoBase64 = async (): Promise<string> => {
  try {
    const asset = Asset.fromModule(require("../assets/images/logo.png"));
    await asset.downloadAsync();

    if (asset.localUri) {
      const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
        encoding: FileSystem.EncodingType.Base64, // ✅ Now works with legacy API
      });
      return `data:image/png;base64,${base64}`;
    }

    return "";
  } catch (error) {
    console.error("Failed to load logo:", error);
    return "";
  }
};

export const generatePDFReport = async (data: ReportData) => {
  const {
    profile,
    logs,
    timeRange,
    totalExpenses,
    totalYield,
    monthlyExpenses,
    activityCounts,
    cropExpenses,
  } = data;

  const now = new Date();
  const reportDate = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Get logo as base64
  const logoBase64 = await getLogoBase64();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Farm Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      padding: 40px;
      background: white;
      color: #1A1A1A;
      line-height: 1.6;
    }
    
    .header {
      border-bottom: 4px solid #1B4332;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo-img {
      width: 50px;
      height: 50px;
      object-fit: contain;
    }
    
    .logo-text {
      font-size: 32px;
      font-weight: bold;
      color: #1B4332;
    }
    
    .header-content {
      flex: 1;
    }
    
    .subtitle {
      font-size: 14px;
      color: #6B7280;
      margin-top: 5px;
    }
    
    .report-title {
      font-size: 24px;
      color: #1B4332;
      margin: 30px 0 10px 0;
      font-weight: bold;
    }
    
    .meta {
      background: #F3F4F6;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    
    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .meta-label {
      color: #6B7280;
      font-size: 13px;
    }
    
    .meta-value {
      color: #1A1A1A;
      font-weight: 600;
      font-size: 13px;
    }
    
    .section {
      margin-bottom: 30px;
      margin-top: 20px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 18px;
      color: #1B4332;
      margin-bottom: 15px;
      padding-top: 20px;
      font-weight: bold;
      border-bottom: 2px solid #E5E7EB;
      padding-bottom: 8px;
    }
    
    .stat-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .stat-card {
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 15px;
    }
    
    .stat-label {
      font-size: 12px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    
    .stat-value {
      font-size: 28px;
      color: #1B4332;
      font-weight: bold;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    
    th {
      background: #1B4332;
      color: white;
      padding: 12px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
    }
    
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #E5E7EB;
      font-size: 13px;
    }
    
    tr:nth-child(even) {
      background: #F9FAFB;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #E5E7EB;
      text-align: center;
      color: #6B7280;
      font-size: 12px;
    }
    
    .highlight {
      color: #1B4332;
      font-weight: 600;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      background: #E8F5E9;
      color: #1B4332;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-container">
      ${logoBase64 ? `<img src="${logoBase64}" alt="Shamba Logo" class="logo-img" />` : "🌱"}
      <span class="logo-text">Shamba</span>
    </div>
    <div class="header-content">
      <div class="subtitle">Farm Activity & Performance Report</div>
    </div>
  </div>
  
  <div class="report-title">
    ${timeRange === "week" ? "Weekly" : timeRange === "month" ? "Monthly" : "Seasonal"} Farm Report
  </div>
  
  <div class="meta">
    <div class="meta-row">
      <span class="meta-label">Farm Name:</span>
      <span class="meta-value">${profile?.farmProfile?.farmName || "N/A"}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Location:</span>
      <span class="meta-value">${profile?.farmProfile?.location || "N/A"}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Farm Size:</span>
      <span class="meta-value">${profile?.farmProfile?.farmSize || "N/A"}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Report Date:</span>
      <span class="meta-value">${reportDate}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Reporting Period:</span>
      <span class="meta-value">${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</span>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Summary</div>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">Total Expenses</div>
        <div class="stat-value">${formatCurrency(totalExpenses)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Yield</div>
        <div class="stat-value">${totalYield.toFixed(0)} kg</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Activities</div>
        <div class="stat-value">${logs.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active Crops</div>
        <div class="stat-value">${profile?.farmProfile?.primaryCrops?.length || 0}</div>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Activity Breakdown</div>
    <table>
      <thead>
        <tr>
          <th>Activity Type</th>
          <th style="text-align: right;">Count</th>
        </tr>
      </thead>
      <tbody>
        ${activityCounts
          .map(
            (activity) => `
          <tr>
            <td>${activity.label}</td>
            <td style="text-align: right;"><span class="highlight">${activity.value}</span></td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>
  
  ${
    cropExpenses.length > 0
      ? `
  <div class="section">
    <div class="section-title">Crop Performance</div>
    <table>
      <thead>
        <tr>
          <th>Crop</th>
          <th style="text-align: right;">Expenses</th>
          <th style="text-align: right;">Harvest</th>
          <th style="text-align: right;">Activities</th>
        </tr>
      </thead>
      <tbody>
        ${cropExpenses
          .map(
            (crop) => `
          <tr>
            <td><span class="badge">${crop.crop}</span></td>
            <td style="text-align: right;">${formatCurrency(crop.expenses)}</td>
            <td style="text-align: right;">${crop.yield} kg</td>
            <td style="text-align: right;">${crop.activities}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>
  `
      : ""
  }
  
  ${
    monthlyExpenses.length > 0
      ? `
  <div class="section">
    <div class="section-title">Monthly Expense Trend</div>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${monthlyExpenses
          .map(
            (month) => `
          <tr>
            <td>${month.label}</td>
            <td style="text-align: right;">${formatCurrency(month.value)}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>
  `
      : ""
  }
  
  ${
    logs.length > 0
      ? `
  <div class="section">
    <div class="section-title">Activity Log (Last ${Math.min(logs.length, 20)} Activities)</div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Activity</th>
          <th>Crop</th>
          <th style="text-align: right;">Cost</th>
          <th style="text-align: right;">Quantity</th>
        </tr>
      </thead>
      <tbody>
        ${logs
          .slice(0, 20)
          .map(
            (log) => `
          <tr>
            <td>${new Date(log.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
            <td>${log.activityType.charAt(0).toUpperCase() + log.activityType.slice(1)}</td>
            <td>${log.crop}</td>
            <td style="text-align: right;">${log.cost ? formatCurrency(log.cost) : "-"}</td>
            <td style="text-align: right;">${log.quantity ? log.quantity + " kg" : "-"}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>
  `
      : ""
  }
  
  <div class="footer">
    <p>Generated by Shamba - Your AI-Powered Farm Tracker</p>
    <p style="margin-top: 5px;">This report was automatically generated on ${reportDate}</p>
  </div>
</body>
</html>
  `;

  try {
    console.log("📄 Generating PDF...");

    const { uri } = await Print.printToFileAsync({ html });

    console.log("✅ PDF generated:", uri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: `Shamba ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Report`,
        UTI: "com.adobe.pdf",
      });
    } else {
      console.warn("⚠️ Sharing is not available on this device");
    }

    return uri;
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    throw error;
  }
};
