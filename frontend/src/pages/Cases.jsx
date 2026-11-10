import React, { useState, useEffect } from 'react';
import { 
  Folder, FolderOpen, ShieldAlert, Plus, Search, FileText, UserCheck, 
  Calendar, ExternalLink, Landmark, TrendingUp, Lock, 
  Coins, ShoppingBag, ChevronRight, ArrowLeft, ShieldCheck,
  CreditCard, MapPin, Radio, Clock, User
} from 'lucide-react';
import axios from 'axios';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const FOLDER_ICONS = {
  'banking-phishing': Landmark,
  'investment-job': TrendingUp,
  'digital-arrest': ShieldAlert,
  'ransomware-extortion': Lock,
  'upi-crypto': Coins,
  'ecommerce-delivery': ShoppingBag
};

export default function Cases({ onTriggerScan }) {
  const [folders, setFolders] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeView, setActiveView] = useState('folders');
  const [openFolderId, setOpenFolderId] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newCaseData, setNewCaseData] = useState({
    title: '',
    firNumber: '',
    category: 'Phishing Scam',
    severity: 'HIGH',
    investigator: 'Insp. Vikram Rathore',
    assignedAgency: 'Cyber Crime Police Cell',
    sourceOfIncident: '',
    victimName: '',
    victimLossInr: '',
    notes: '',
    evidenceType: 'Domain / URL',
    evidenceValue: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [foldersRes, casesRes] = await Promise.all([
        axios.get('/api/scam-folders'),
        axios.get(`/api/cases?search=${encodeURIComponent(search)}`)
      ]);

      if (foldersRes.data.success) {
        setFolders(foldersRes.data.data);
      }
      if (casesRes.data.success) {
        setCases(casesRes.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch cases and scam folders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleCreateCase = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newCaseData.title,
        firNumber: newCaseData.firNumber,
        category: newCaseData.category,
        severity: newCaseData.severity,
        investigator: newCaseData.investigator,
        assignedAgency: newCaseData.assignedAgency,
        sourceOfIncident: newCaseData.sourceOfIncident || 'Online Victim Complaint',
        victimName: newCaseData.victimName || 'Anonymous Victim',
        victimLoss: newCaseData.victimLossInr || '500000',
        evidence: newCaseData.evidenceValue ? [
          {
            type: newCaseData.evidenceType,
            value: newCaseData.evidenceValue,
            source: 'Initial FIR Intake'
          }
        ] : [],
        notes: newCaseData.notes
      };

      const res = await axios.post('/api/cases', payload);
      if (res.data.success) {
        setShowCreateModal(false);
        setNewCaseData({
          title: '', firNumber: '', category: 'Phishing Scam', severity: 'HIGH',
          investigator: 'Insp. Vikram Rathore', assignedAgency: 'Cyber Crime Police Cell',
          sourceOfIncident: '', victimName: '', victimLossInr: '', notes: '', evidenceType: 'Domain / URL', evidenceValue: ''
        });
        fetchData();
      }
    } catch (err) {
      alert('Error creating case: ' + (err.response?.data?.error || err.message));
    }
  };

  const selectedFolder = folders.find(f => f.id === openFolderId);

  return (
    <div className="space-y-6 font-sans">
      {/* Standardized Page Header */}
      <PageHeader
        badge="CASE CLASSIFICATION"
        title="Cybercrime Scam Category Folders"
        subtitle="Simplified FIR case files with Source of Incident, Amount Lost (INR ₹), Incident Date & Transactions"
        breadcrumb={['Suite', 'Cases & FIRs']}
        actions={
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center font-mono text-xs">
              <button
                onClick={() => { setActiveView('folders'); setOpenFolderId(null); }}
                className={`h-8 px-3 rounded-lg font-bold transition-all ${
                  activeView === 'folders' && !openFolderId ? 'bg-cyan-500 text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                📁 SCAM FOLDERS
              </button>
              <button
                onClick={() => { setActiveView('all'); setOpenFolderId(null); }}
                className={`h-8 px-3 rounded-lg font-bold transition-all ${
                  activeView === 'all' ? 'bg-cyan-500 text-black shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                📋 ALL CASE FILES ({cases.length})
              </button>
            </div>

            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowCreateModal(true)}
            >
              REGISTER NEW FIR
            </Button>
          </div>
        }
      />

      {/* Standardized Search Bar */}
      <Input
        icon={Search}
        placeholder="Search by FIR Number, Victim Name, Source of Incident, or Evidence..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Breadcrumb Navigation if Folder is Open */}
      {openFolderId && selectedFolder && (
        <div className="flex items-center justify-between font-mono text-xs bg-slate-900/90 p-4 rounded-xl border border-cyan-500/40 text-slate-300 shadow-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setOpenFolderId(null)}
              className="flex items-center gap-1 text-cyan-400 hover:underline font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> Scam Folders
            </button>
            <span className="text-slate-600">/</span>
            <span className="font-bold text-white flex items-center gap-2 text-sm font-sans">
              <FolderOpen className="w-4 h-4 text-cyan-400" /> {selectedFolder.name} ({selectedFolder.cases.length} Case Files)
            </span>
          </div>

          <Badge variant="success" size="md">
            Category Loss: {selectedFolder.totalLossFormatted}
          </Badge>
        </div>
      )}

      {/* VIEW 1: SCAM CATEGORY FOLDERS GRID */}
      {activeView === 'folders' && !openFolderId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map(folder => {
            const IconComponent = FOLDER_ICONS[folder.id] || Folder;
            return (
              <div
                key={folder.id}
                onClick={() => setOpenFolderId(folder.id)}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-6 shadow-xl transition-all duration-200 cursor-pointer group hover:-translate-y-1 font-mono space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <Badge variant="info" size="md">
                    {folder.caseCount} Cases
                  </Badge>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-sans group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                    {folder.name}
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-2 line-clamp-2 leading-relaxed">{folder.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Total Amount Lost (INR ₹):</span>
                    <span className="text-emerald-400 font-black text-sm">{folder.totalLossFormatted}</span>
                  </div>

                  {folder.criticalCount > 0 && (
                    <Badge variant="critical" size="sm">
                      {folder.criticalCount} Critical
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: CLEAN & SIMPLE INDIVIDUAL CASE CARDS */}
      {(openFolderId || activeView === 'all') && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-400 font-mono text-xs">Loading case files...</div>
          ) : (openFolderId ? selectedFolder?.cases : cases).length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 font-mono text-xs">
              No matching case files found in this category.
            </div>
          ) : (
            (openFolderId ? selectedFolder?.cases : cases).map((c) => (
              <Card key={c.id} className="space-y-4 shadow-xl border-slate-800/80">
                
                {/* 1. Header Bar: FIR Badge & Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 font-bold font-mono text-sm px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                      {c.firNumber}
                    </span>
                    <Badge variant={c.severity === 'CRITICAL' ? 'critical' : c.severity === 'HIGH' ? 'warning' : 'info'} size="sm">
                      {c.severity}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs font-mono flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> {c.investigator}
                    </span>
                    <Button variant="secondary" size="sm" onClick={() => setSelectedCase(c)}>
                      View Details
                    </Button>
                  </div>
                </div>

                {/* 2. Case Title */}
                <div>
                  <h3 className="text-lg font-bold text-slate-100 font-sans">{c.title}</h3>
                </div>

                {/* 3. Simple 4-Key Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] font-mono block">💰 Amount Lost (INR ₹):</span>
                    <span className="text-emerald-400 font-black text-sm">{c.victim.lossAmountFormatted || `₹${c.victim.lossAmountInr?.toLocaleString('en-IN')}`}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] font-mono block">📍 Source of Incident:</span>
                    <span className="text-slate-200 font-semibold truncate block">{c.sourceOfIncident || 'Online Victim Complaint'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] font-mono block">🗓️ Date & Time:</span>
                    <span className="text-amber-300 font-semibold block">{c.incidentDateTime || '01 Aug 2026, 09:30 AM'}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] font-mono block">👤 Victim & Location:</span>
                    <span className="text-slate-200 font-semibold block">{c.victim.name} ({c.victim.city})</span>
                  </div>
                </div>

                {/* 4. Simple Transactions List */}
                {c.transactions && c.transactions.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs font-mono text-slate-400 font-bold">
                      💳 Transactions ({c.transactions.length}):
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {c.transactions.map((tx, idx) => (
                        <div key={idx} className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">{tx.formattedAmount}</span>
                          <span className="text-slate-500">|</span>
                          <span className="text-slate-300">{tx.mode}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-cyan-300 font-semibold">{tx.beneficiary}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Simple Evidence Indicators */}
                {c.evidence && c.evidence.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-mono text-slate-400">IOC Evidence:</span>
                    <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                      {c.evidence.map((ev) => (
                        <span key={ev.id} className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                          <span className="text-cyan-400 font-bold">{ev.type}:</span> {ev.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </Card>
            ))
          )}
        </div>
      )}

      {/* Case Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-6 text-slate-200 text-xs shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <Badge variant="info" size="md">{selectedCase.firNumber}</Badge>
                <h2 className="text-xl font-bold text-white font-sans mt-1">{selectedCase.title}</h2>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setSelectedCase(null)}>Close</Button>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Source of Incident:</span>
                <div className="font-bold text-cyan-300 text-sm mt-0.5">{selectedCase.sourceOfIncident || 'Online Complaint'}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Date & Time:</span>
                <div className="font-bold text-amber-300 text-sm mt-0.5">{selectedCase.incidentDateTime || '01 Aug 2026'}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Victim Info:</span>
                <div className="font-bold text-slate-200 text-sm mt-0.5">{selectedCase.victim.name} ({selectedCase.victim.contact})</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Amount Lost (INR ₹):</span>
                <div className="font-black text-emerald-400 text-base mt-0.5">{selectedCase.victim.lossAmountFormatted || `₹${selectedCase.victim.lossAmountInr?.toLocaleString('en-IN')}`}</div>
              </div>
            </div>

            {/* Transactions Section */}
            {selectedCase.transactions && (
              <div className="space-y-2 font-mono">
                <h4 className="font-bold text-slate-200 text-xs uppercase">Transaction Details</h4>
                <div className="space-y-2">
                  {selectedCase.transactions.map((tx, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="text-emerald-400 font-bold">{tx.formattedAmount} ({tx.mode})</div>
                        <div className="text-slate-400">Beneficiary: <span className="text-cyan-300">{tx.beneficiary}</span></div>
                      </div>
                      <div className="text-slate-500 text-[10px]">{tx.dateTime}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Register New FIR Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreateCase} className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 text-xs text-slate-200 shadow-2xl">
            <h2 className="text-xl font-bold text-white font-sans border-b border-slate-800 pb-3">Register New FIR</h2>

            <div className="space-y-4">
              <Input
                label="FIR / Complaint Number"
                required
                placeholder="e.g. FIR/2026/CYBER/0981"
                value={newCaseData.firNumber}
                onChange={e => setNewCaseData({ ...newCaseData, firNumber: e.target.value })}
              />

              <Input
                label="Case Title"
                required
                placeholder="e.g. Banking Phishing Campaign"
                value={newCaseData.title}
                onChange={e => setNewCaseData({ ...newCaseData, title: e.target.value })}
              />

              <Input
                label="Source of Incident"
                placeholder="e.g. WhatsApp Smishing Link"
                value={newCaseData.sourceOfIncident}
                onChange={e => setNewCaseData({ ...newCaseData, sourceOfIncident: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase font-bold text-[10px]">Category:</label>
                  <select
                    value={newCaseData.category}
                    onChange={e => setNewCaseData({ ...newCaseData, category: e.target.value })}
                    className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-cyan-500"
                  >
                    <option>Phishing Scam</option>
                    <option>Banking Fraud</option>
                    <option>Investment Fraud</option>
                    <option>Job Scam</option>
                    <option>Digital Arrest</option>
                    <option>Ransomware</option>
                    <option>UPI Fraud</option>
                    <option>Crypto Fraud</option>
                    <option>E-Commerce Scam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase font-bold text-[10px]">Severity:</label>
                  <select
                    value={newCaseData.severity}
                    onChange={e => setNewCaseData({ ...newCaseData, severity: e.target.value })}
                    className="w-full h-10 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs outline-none focus:border-cyan-500"
                  >
                    <option>CRITICAL</option>
                    <option>HIGH</option>
                    <option>MEDIUM</option>
                    <option>LOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Victim Name"
                  placeholder="Victim Name"
                  value={newCaseData.victimName}
                  onChange={e => setNewCaseData({ ...newCaseData, victimName: e.target.value })}
                />
                <Input
                  label="Amount Lost (INR ₹)"
                  placeholder="e.g. 500000"
                  value={newCaseData.victimLossInr}
                  onChange={e => setNewCaseData({ ...newCaseData, victimLossInr: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary">REGISTER FIR</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
