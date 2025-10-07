import { Alert } from '@heroui/react'
import { motion, AnimatePresence } from "framer-motion"

const PopUpAlert = ({ isVisible, setIsVisible, text, color }) => {

    console.log(isVisible, text, color)

    return (
        <>
            {isVisible && (
                <div className="fixed bottom-4 right-4 z-50 w-full max-w-xl">
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full"
                        >
                            <Alert
                                isVisible={isVisible}
                                description={text || ""}
                                color={color || "default"}
                                onClose={() => setIsVisible(false)}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}
        </>
    )
}

export default PopUpAlert