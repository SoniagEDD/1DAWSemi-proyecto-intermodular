package pmo.daw.semi;

import java.io.IOException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.servlet.ServletComponentScan;

@EnableConfigurationProperties
@ServletComponentScan
@SpringBootApplication(exclude = DataSourceTransactionManagerAutoConfiguration.class)
public class BackEndApplication {
	public static void main(String[] args) throws IOException {
		SpringApplication.run(BackEndApplication.class, args);
	}
}
