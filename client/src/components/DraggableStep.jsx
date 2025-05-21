import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
const ItemTypes = {
    STEP: 'step',
};

const DraggableStep = ({
    step,
    index,
    moveStep,
    handleRemoveStep,
    handleRemoveStepImage,
    handleStepImageUpload,
    stepImagePreviews,
}) => {
    const ref = useRef(null);

    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.STEP,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveStep(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.STEP,
        item: () => ({ id: step.id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            data-handler-id={handlerId}
        >
            <Box
                sx={{
                    mb: 2,
                    p: 2,
                    border: '1px solid #eee',
                    borderRadius: 1,
                    backgroundColor: 'background.paper',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1">
                        Шаг {step.order}: {step.title}
                        {step.id && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                (ID: {step.id})
                            </Typography>
                        )}
                    </Typography>
                    <Box>
                        <IconButton sx={{ cursor: 'grab', mr: 1 }} size="small">
                            <DragIndicatorIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => handleRemoveStep(index)}
                            size="small"
                        >
                            <RemoveIcon color="error" fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    {step.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Время: {step.durationMin} мин
                </Typography>

                {stepImagePreviews[index] ? (
                    <Box sx={{ mt: 2, position: 'relative', width: '100%', maxWidth: 400 }}>
                        <img
                            src={stepImagePreviews[index]}
                            alt={`Шаг ${step.order}`}
                            style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 1 }}
                        />
                        <IconButton
                            onClick={() => handleRemoveStepImage(index)}
                            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                ) : (<></>
                    // <Button
                    //     component="label"
                    //     variant="outlined"
                    //     startIcon={<CloudUploadIcon />}
                    //     sx={{ mt: 2 }}
                    // >
                    //     Добавить фото к шагу
                    //     <VisuallyHiddenInput
                    //         type="file"
                    //         accept="image/*"
                    //         onChange={(e) => handleStepImageUpload(e, index)}
                    //     />
                    // </Button>
                )}
            </Box>
        </div>
    );
};

export default DraggableStep