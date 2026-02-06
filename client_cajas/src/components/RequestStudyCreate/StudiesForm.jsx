import { Checkbox, CheckboxGroup } from '@heroui/react'

const StudiesForm = ({
    studies,
    studiesRequested,
    setStudiesRequested,
    studiesEyes,
    setStudiesEyes,
    isFormLocked
}) => {
    const EYES = [
        { label: 'AO', id: 'BOTH' },
        { label: 'OI', id: 'LEFT' },
        { label: 'OD', id: 'RIGHT' }
    ]

    const handleEyeSelection = (studyId, eye) => {
        setStudiesEyes(prev => ({ ...prev, [studyId]: eye }))
    }

    return (
        <div className="flex flex-col col-span-3 gap-4 w-full">
            <div className="flex flex-col gap-2">
                <CheckboxGroup
                    isRequired
                    value={studiesRequested}
                    onValueChange={setStudiesRequested}
                    isDisabled={isFormLocked}
                    label="Estudios"
                    classNames={{
                        wrapper: "grid grid-cols-2 gap-1"
                    }}
                >
                    {studies?.map((study) => (
                        <div key={study.id} className={`flex flex-row items-center justify-between gap-1 mx-4 py-0.5 px-1 rounded-lg ${studiesRequested?.includes(String(study.id)) && 'bg-gray-100'}`}>
                            <Checkbox value={String(study.id)}>
                                {study.name}
                            </Checkbox>
                            {studiesRequested?.includes(String(study.id)) && (
                                <div className="flex gap-0.5">
                                    {EYES.map((eye) => (
                                        <button
                                            key={eye.id}
                                            type="button"
                                            onClick={() => handleEyeSelection(study.id, eye.id)}
                                            className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors font-mono ${
                                                (studiesEyes[study.id] || 'BOTH') === eye.id
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'
                                            }`}
                                        >
                                            {eye.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </CheckboxGroup>
            </div>
        </div>
    )
}

export default StudiesForm