import ClassroomService from './classroom.service';

const POLL_INTERVAL = 30000; // 30 seconds

let pollTimer = null;

const notificationService = {
    startPolling: (addNotification) => {
        if (pollTimer) return;

        const checkNewClasses = async () => {
            try {
                const classes = await ClassroomService.getUpcomingClasses();
                const now = new Date();

                classes.forEach(cls => {
                    if (cls.date === 'TBD' || cls.time === 'TBD') return;

                    const classTime = new Date(`${cls.date}T${cls.time}`);
                    if (isNaN(classTime.getTime())) return;

                    const diffMinutes = (classTime - now) / (1000 * 60);

                    // Notify if class is starting in less than 60 minutes
                    if (diffMinutes > 0 && diffMinutes <= 60) {
                        addNotification({
                            id: `class-${cls.id}`,
                            title: 'Upcoming Class',
                            message: `${cls.title} is starting shortly at ${cls.time}.`,
                            type: 'class',
                            data: { classId: cls.id }
                        });
                    }
                });
            } catch (error) {
                console.error('Failed to poll notifications', error);
            }
        };

        // Run immediately
        checkNewClasses();

        // Then poll
        pollTimer = setInterval(checkNewClasses, POLL_INTERVAL);
    },

    stopPolling: () => {
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
        }
    }
};

export default notificationService;
