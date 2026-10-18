"use client";

import { useState } from "react";
import { Clock, Shield, Filter, Search } from "lucide-react";

interface ActivityLogItem {
  id: string | number;
  user_name?: string | null;
  userName?: string | null;
  user_email?: string | null;
  userEmail?: string | null;
  action: string;
  entity: string;
  entity_id?: string | null;
  entityId?: string | null;
  details?: string | null;
  created_at?: string;
  createdAt?: string;
}

export function ActivityLogClient({ initialLogs }: { initialLogs: ActivityLogItem[] }) {
  const [logs] = useState<ActivityLogItem[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<string>("ALL");

  const entities = ["ALL", ...Array.from(new Set(logs.map((l) => l.entity).filter(Boolean)))];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.userName && log.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.user_name && log.user_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEntity = selectedEntity === "ALL" || log.entity === selectedEntity;

    return matchesSearch && matchesEntity;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#3A2418]/10 shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#3A2418]/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activities or administrators..."
            className="w-full text-sm bg-transparent border-none focus:outline-hidden text-[#3A2418]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#3A2418]/40" />
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#3A2418]/20 bg-[#FAF6F0] text-[#3A2418] focus:outline-hidden"
          >
            {entities.map((ent) => (
              <option key={ent} value={ent}>
                {ent === "ALL" ? "All Entities" : ent}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-[#3A2418]/10 overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-12 h-12 text-[#3A2418]/30 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#3A2418]">No activity records found</h3>
            <p className="text-sm text-[#3A2418]/60 mt-1">
              Actions taken by owners and editors will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF6F0] text-[#3A2418] text-xs uppercase font-bold tracking-wider border-b border-[#3A2418]/10">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Administrator</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Target Entity</th>
                  <th className="py-3.5 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A2418]/5">
                {filteredLogs.map((log) => {
                  const dateStr = log.created_at || log.createdAt;
                  const formattedDate = dateStr
                    ? new Date(dateStr).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recent";

                  return (
                    <tr key={log.id} className="hover:bg-[#FAF6F0]/50 transition-colors">
                      <td className="py-3.5 px-4 text-xs text-[#3A2418]/60 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-xs text-[#3A2418]">
                          {log.userName || log.user_name || log.userEmail || log.user_email || "System"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF6F0] text-[#3A2418] border border-[#3A2418]/10">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#6A9A8A]">
                        {log.entity}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#3A2418]/80 max-w-md truncate">
                        {log.details || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
