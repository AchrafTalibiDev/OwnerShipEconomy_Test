import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [ownershipFilter, setOwnershipFilter] = useState("");
    const [industryFilter, setIndustryFilter] = useState("");

    useEffect(() => {
        fetchCompanies();
    }, [search, typeFilter, ownershipFilter, industryFilter]);

    const fetchCompanies = async () => {
        let query = supabase.from("companies").select("*");

        if (search) {
            query = query.ilike("name", `%${search}%`);
        }
        if (typeFilter) {
            query = query.eq("type_of_organization", typeFilter);
        }
        if (ownershipFilter) {
            query = query.contains("ownership_structure", [ownershipFilter]);
        }
        if (industryFilter) {
            query = query.eq("industry", industryFilter);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Erreur lors de la récupération :", error.message);
        } else {
            setCompanies(data);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">🔍 Company Search</h1>

            {/* Barre de recherche */}
            <input
                type="text"
                placeholder="Search By Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 w-full mb-4"
            />

            {/* Filtres */}
            <div className="flex gap-4 mb-4">
                <select onChange={(e) => setTypeFilter(e.target.value)} className="border p-2">
                    <option value="">Organization Type</option>
                    <option value="Cooperative">Cooperative</option>
                    <option value="DAO">DAO</option>
                    <option value="Crypto/Web3 Company">Crypto/Web3</option>
                    <option value="Employee-Owned Company">Employee-Owned</option>
                </select>

                <select onChange={(e) => setOwnershipFilter(e.target.value)} className="border p-2">
                    <option value="">Ownership Structure</option>
                    <option value="Worker Cooperative">Worker Cooperative</option>
                    <option value="Token-based Ownership">Token-Based Ownership</option>
                    <option value="Member-Owned">Member-Owned</option>
                </select>

                <select onChange={(e) => setIndustryFilter(e.target.value)} className="border p-2">
                    <option value="">Industry</option>
                    <option value="64.19 - Other monetary intermediation">Finance</option>
                    <option value="01.11 - Growing of cereals">Agriculture</option>
                </select>
            </div>

            {/* Affichage des entreprises */}
            <ul className="border p-4">
                {companies.length > 0 ? (
                    companies.map((company) => (
                        <li key={company.id} className="p-2 border-b">
                            <strong>{company.name}</strong> - {company.type_of_organization}
                        </li>
                    ))
                ) : (
                    <p>Company Not Found.</p>
                )}
            </ul>
        </div>
    );
};

export default CompanyList;