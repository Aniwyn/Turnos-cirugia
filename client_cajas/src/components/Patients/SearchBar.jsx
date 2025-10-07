import { Button, Input } from "@heroui/react"

const SearchBar = ({queryTerms, handleFilters, handleSearch}) => {

    return (
        <div className="flex gap-2 items-end">
            <Input 
                label="ID"
                labelPlacement="outside"
                value={queryTerms.id || ""} 
                onChange={(e) => handleFilters("id", e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                className="w-full max-w-[90px]"
                isClearable
                onClear={() => handleFilters("id", "")}
            />
            <Input
                label="DNI" 
                labelPlacement="outside"
                value={queryTerms.dni || ""}
                onChange={(e) => handleFilters("dni", e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                className="w-full max-w-[110px]"
                isClearable
                onClear={() => handleFilters("dni", "")}
            />
            <Input
                label="Apellido"
                labelPlacement="outside"
                value={queryTerms.last_name || ""}
                onChange={(e) => handleFilters("last_name", e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                className="w-full"
                isClearable
                onClear={() => handleFilters("last_name", "")}
            />
            <Input
                label="Nombre"
                labelPlacement="outside"
                value={queryTerms.first_name || ""}
                onChange={(e) => handleFilters("first_name", e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                className="w-full"
                isClearable
                onClear={() => handleFilters("first_name", "")}
            />
            <Input
                label="Obra Social"
                labelPlacement="outside"
                value={queryTerms.health_insurance || ""}
                onChange={(e) => handleFilters("health_insurance", e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                className="w-full"
                isClearable
                onClear={() => handleFilters("health_insurance", "")}
            />
            <Button color="primary" onPress={() => handleSearch()}>Buscar</Button>
        </div>
    )
}

export default SearchBar