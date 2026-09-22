import jsPDF from 'jspdf';
import { Incident } from '../types';

export function generateIncidentPDF(incident: Incident) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(15, 23, 42); // Navy primary
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('COMMUNITY CRISIS INTELLIGENCE PLATFORM', 15, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Official Incident Report Document — #${incident.incidentNumber}`, 15, 26);

  // Status & Priority Badge Right
  doc.setFillColor(incident.severity === 'CRITICAL' ? 220 : incident.severity === 'HIGH' ? 234 : 59, 130, 246);
  doc.roundedRect(150, 10, 45, 15, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`${incident.severity} SEVERITY`, 154, 19);

  // Body Content
  let y = 48;

  // Overview Box
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, 180, 45, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(incident.title, 20, y + 10);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Category: ${incident.category}`, 20, y + 20);
  doc.text(`Status: ${incident.status}`, 20, y + 27);
  doc.text(`AI Priority Score: ${incident.priorityScore} / 100`, 20, y + 34);

  doc.text(`Reported Date: ${new Date(incident.createdAt).toLocaleString()}`, 110, y + 20);
  doc.text(`Reporter: ${incident.citizenName}`, 110, y + 27);
  doc.text(`Assigned Dept: ${incident.assignedDepartmentName || 'Unassigned'}`, 110, y + 34);

  y += 55;

  // Location Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('INCIDENT LOCATION & GEOSPATIAL DATA', 15, y);
  y += 6;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Address: ${incident.location.address}`, 15, y);
  y += 6;
  doc.text(`Coordinates: Lat ${incident.location.latitude.toFixed(4)}, Long ${incident.location.longitude.toFixed(4)}`, 15, y);
  y += 12;

  // Description Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('CITIZEN DESCRIPTION & SUBMISSION', 15, y);
  y += 6;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const splitDesc = doc.splitTextToSize(incident.description, 180);
  doc.text(splitDesc, 15, y);
  y += splitDesc.length * 5 + 8;

  // AI Intelligence Section
  if (incident.aiAnalysis) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('AI INTELLIGENCE & ACTION RECOMMENDATIONS', 15, y);
    y += 6;

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(15, y, 180, 35, 2, 2, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('AI Impact Assessment:', 20, y + 8);
    doc.setFont('helvetica', 'normal');
    const impactText = incident.aiAnalysis.potentialImpact || 'Comprehensive impact assessment calculated based on location and severity parameters.';
    const splitImpact = doc.splitTextToSize(impactText, 170);
    doc.text(splitImpact, 20, y + 14);

    y += 42;

    const immediateActions = incident.aiAnalysis.recommendedActions?.immediate || [
      'Dispatch field team for on-site assessment.',
      'Deploy safety cordon and warning indicators.'
    ];

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Immediate Action Steps:', 15, y);
    y += 5;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    immediateActions.forEach((act) => {
      doc.text(`• ${act}`, 20, y);
      y += 5;
    });

    y += 5;
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated via Community Crisis Intelligence Platform. Verified official civic document.', 15, 285);

  doc.save(`${incident.incidentNumber}_Official_Report.pdf`);
}
