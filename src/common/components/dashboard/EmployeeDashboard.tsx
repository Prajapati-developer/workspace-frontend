import {
  Grid,
  Container,
  Card,
  CardContent,
  Typography,
  Paper,
} from "@mui/material";
import { BarChart, axisClasses } from "@mui/x-charts";

import { PieChart } from "@mui/x-charts/PieChart";

const leaveData = [
  {
    month: "January",
    leaveCount: 4,
    plannedLeaveCount: 1,
    unplannedLeaveCount: 2,
  },
  {
    month: "February",
    leaveCount: 3,
    plannedLeaveCount: 6,
    unplannedLeaveCount: 5,
  },
  {
    month: "March",
    leaveCount: 5,
    plannedLeaveCount: 3,
    unplannedLeaveCount: 6,
  },
  // Add more months as needed
];
const EmployeeDashboard = () => {
  const chartSetting = {
    yAxis: [{ label: "Leave Count" }], // Customize yAxis label if needed
    width: 550,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-5px, 0)",
      },
    },
  };

  const valueFormatter = (value: number | null) => `${value}`;
  return (
    <>
      <Container sx={{ paddingTop: 5, paddingBottom: 20 }}>
        <Typography variant="h3" className="mb-4" component="div">
          Dashboard
        </Typography>
        <Grid container spacing={2}>
          <Grid item lg={8} md={12}>
            <Paper elevation={3} sx={{ padding: 5 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Leave Stats
              </Typography>

              <BarChart
                dataset={leaveData}
                xAxis={[{ scaleType: "band", dataKey: "month" }]}
                series={[
                  {
                    dataKey: "leaveCount",
                    label: "Leave Count",
                    valueFormatter,
                  },
                  {
                    dataKey: "plannedLeaveCount",
                    label: "Planned Leave Count",
                    valueFormatter,
                  },
                  {
                    dataKey: "unplannedLeaveCount",
                    label: "Unplanned Leave Count",
                    valueFormatter,
                  },
                ]}
                {...chartSetting}
              />
            </Paper>
          </Grid>
          <Grid item lg={4} md={12}>
            <Grid container spacing={3}>
              <Grid item lg={12} md={12}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      className="text-success"
                    >
                      Available Casual Leave
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                      {10}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={12} md={12}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      className="text-warning"
                    >
                      Available Sick Leave
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                      {5}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={12} md={12}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      className="text-danger"
                      component="div"
                    >
                      Total Consumed Leave
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                      {5}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={6} md={12}>
            <Paper elevation={3} sx={{ padding: 5 }}>
              <Typography variant="h6" gutterBottom>
                Employees Categorize
              </Typography>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: "Engineers" },
                      { id: 1, value: 15, label: "Designers" },
                      { id: 2, value: 20, label: "Managers" },
                      // Add more data points as needed
                    ],
                  },
                ]}
                width={400}
                height={200}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
export default EmployeeDashboard;
