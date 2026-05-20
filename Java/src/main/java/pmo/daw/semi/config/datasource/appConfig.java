package pmo.daw.semi.config.datasource;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import pmo.daw.semi.transactionmanager.TransactionManager;

@Configuration
public class appConfig {

	@Bean(name = "javaDataSource")
	@ConfigurationProperties(prefix = "datasource")
	DataSource javaDataSource() {
		return DataSourceBuilder.create().build();
	}

	// TransactionManager singleton configurado con el DataSource
	@Bean
	TransactionManager transactionManager(@Qualifier("javaDataSource") DataSource dataSource) {
		TransactionManager tm = TransactionManager.getInstance();
		tm.setDataSource(dataSource);
		return tm;
	}

	// Carga de scripts después de que la app esté lista (Tablas y datos iniciales)
	@Bean
	ApplicationRunner loadJavaScripts(@Qualifier("javaDataSource") DataSource dataSource) {
		return args -> {
			ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
			populator.addScript(new ClassPathResource("schema-jdbc.sql"));
			populator.addScript(new ClassPathResource("data-jdbc.sql"));
			populator.execute(dataSource);
		};
	}

	// FILTRO GLOBAL DE CORS: Intercepta y autoriza las peticiones HTTP (incluidas las OPTIONS)
	@Bean
	CorsFilter corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		
		config.setAllowCredentials(true);
		// Añadimos tanto la IP de Live Server como localhost para curarnos en salud
		config.addAllowedOrigin("http://127.0.0.1:5500");
		config.addAllowedOrigin("http://localhost:5500");
		config.addAllowedHeader("*");
		// Habilitamos todos los métodos necesarios explicitamente
		config.addAllowedMethod("GET");
		config.addAllowedMethod("POST");
		config.addAllowedMethod("PUT");
		config.addAllowedMethod("DELETE");
		config.addAllowedMethod("OPTIONS");
		
		// Aplicamos esta configuración a todas las rutas de la API
		source.registerCorsConfiguration("/api/**", config);
		return new CorsFilter(source);
	}
}